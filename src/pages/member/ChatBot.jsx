import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBalanceScale, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa';
import { chatWithGemini, getChatHistory } from '../../services/chat';
import { formatDateChatBot, getDateKey } from '../../utils/index';
import { quickOptions } from './constants/index';

export const formatMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={index}>{content}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  // ref cho container chat và textarea để xử lý scroll và focus input
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const userId = localStorage.getItem('userId');

  // lấy lịch sử chat
  const { data: messagesList } = useQuery({
    queryKey: ['chatHistory', userId],
    queryFn: () => getChatHistory(userId),
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 3,
  });

  const listMessage = (messagesList && messagesList.data) || [];

  // convert danh sách tin nhắn thành dạng data để map (theo ngày, phân biệt người gửi (bot/user))
  const transformedMessages = useMemo(() => {
    const groupedMessages = [];
    let lastDateKey = null;

    // sắp xếp tin nhắn theo thời gian
    const sortedMessages = [...listMessage].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    sortedMessages.forEach((msg) => {
      const dateKey = getDateKey(msg.timestamp);
      const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Thêm separator ngày nếu khác ngày
      if (dateKey !== lastDateKey) {
        groupedMessages.push({
          type: 'date',
          date: formatDateChatBot(msg.timestamp),
          timestamp: msg.timestamp,
        });
        lastDateKey = dateKey;
      }

      // tin nhắn user
      groupedMessages.push({
        type: 'message',
        sender: 'me',
        text: msg.question,
        time,
        timestamp: msg.timestamp,
      });

      // tin nhắn bot
      groupedMessages.push({
        type: 'message',
        sender: 'other',
        text: msg.answer,
        time,
        timestamp: msg.timestamp,
      });
    });

    return groupedMessages;
  }, [listMessage]);

  // focus vào textarea nhập tin nhắn
  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Voice recognition
  const handleVoiceClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      focusTextarea();
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // scoll xuống cuối khung chat
  const scrollToBottom = (force = false) => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const clientHeight = chatContainerRef.current.clientHeight;
      const scrollTop = chatContainerRef.current.scrollTop;

      if (force || scrollHeight - scrollTop - clientHeight < 100) {
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  // cập nhật tin nhắn khi có dữ liệu mới hoặc khởi tạo lần đầu
  useEffect(() => {
    if (listMessage.length > 0) {
      const newMessages = transformedMessages;

      const isDifferent =
        newMessages.length !== messages.length ||
        newMessages.some((msg, i) => msg.timestamp !== messages[i]?.timestamp);

      if (isDifferent) {
        setMessages(newMessages);
        const hasUserMessage = transformedMessages.some(
          (msg) => msg.type === 'message' && msg.sender === 'me',
        );
        if (hasUserMessage) {
          setHasUserSentMessage(true);
        }

        if (!isInitialized) {
          setIsInitialized(true);
          setTimeout(() => {
            scrollToBottom(true);
            focusTextarea();
          }, 100);
        }
      }
    } else if (messages.length === 0) {
      // tin nhắn mới vào khi chưa có lịch sử chat
      const initialMessage = {
        type: 'message',
        sender: 'other',
        text: 'Xin chào! Tôi là SmartLaw AI - Trợ lý tư vấn pháp luật thông minh. Tôi có thể giúp bạn với các vấn đề về luật giao thông, dân sự, hình sự, lao động và nhiều lĩnh vực khác. Bạn cần tư vấn về vấn đề gì?',
        time: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: new Date().toISOString(),
      };

      setMessages([initialMessage]);
      setIsInitialized(true);
      setTimeout(() => {
        scrollToBottom(true);
        focusTextarea();
      }, 100);
    }
  }, [listMessage, transformedMessages]);

  // tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [messages, isInitialized]);

  // hiển thị animation khi mở chat bot
  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => {
      setShowAnimation(false);
      focusTextarea();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // tự động điều chỉnh chiều cao textarea khi nhập
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // xử lý gửi tin nhắn
  const handleSend = async (message = input) => {
    if (!message.trim() || isLoading) return;

    // đánh dấu rằng người dùng đã gửi ít nhất một tin nhắn
    setHasUserSentMessage(true);

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // lấy tin nhắn cuối cùng trong danh sách tin nhắn
    const lastMessage = messages[messages.length - 1];

    // xác định xem có cần hiển thị dải phân cách ngày mới hay không
    const needDateSeparator =
      lastMessage &&
      getDateKey(now.toISOString()) !== getDateKey(lastMessage.timestamp);

    // tạo mảng tin nhắn mới dựa trên tin nhắn hiện tại
    const newMessages = [...messages];

    // nếu cần dải phân cách ngày thì thêm vào (Hôm nay / Hôm qua / Ngày khác)
    if (needDateSeparator) {
      newMessages.push({
        type: 'date',
        date: formatDateChatBot(now.toISOString()),
        timestamp: now.toISOString(),
      });
    }

    // thêm tin nhắn của người dùng vào danh sách
    newMessages.push({
      type: 'message',
      sender: 'me',
      text: message.trim(),
      time,
      timestamp: now.toISOString(),
    });

    // cập nhật danh sách tin nhắn và reset input
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // focus lại vào khung nhập tin nhắn sau khi gửi
    setTimeout(() => {
      focusTextarea();
    }, 10);

    try {
      // gọi API để nhận phản hồi từ chatbot
      const res = await chatWithGemini(message.trim(), userId);

      // fake delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // lấy nội dung phản hồi
      const answer =
        res?.data?.answer ||
        res?.data ||
        'Không nhận được phản hồi từ hệ thống';

      setIsTyping(false);

      // thêm phản hồi từ chatbot vào danh sách tin nhắn
      setMessages((prev) => [
        ...prev,
        {
          type: 'message',
          sender: 'other',
          text: answer,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          timestamp: new Date().toISOString(),
        },
      ]);

      setTimeout(() => {
        focusTextarea();
      }, 100);
    } catch {
      setIsTyping(false);
      // thêm tin nhắn báo lỗi vào danh sách (nếu cần)
      setMessages((prev) => [
        ...prev,
        {
          type: 'message',
          sender: 'other',
          text: 'Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại.',
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          timestamp: new Date().toISOString(),
        },
      ]);

      setTimeout(() => {
        focusTextarea();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // hỗ trợ chọn câu hỏi nhanh
  const handleQuickOption = (option) => {
    handleSend(option.query);
  };

  // xử lý gửi tin nhắn khi nhấn Enter (không giữ shift)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // khi click vào vùng chat thì focus vào textarea nếu không loading
  const handleChatContainerClick = () => {
    if (!isLoading) {
      focusTextarea();
    }
  };

  // hiển thị các câu hỏi nhanh nếu chưa gửi tin nhắn nào
  const showQuickOptions = !hasUserSentMessage;

  return (
    <div className="w-full h-full max-w-4xl mx-auto">
      <div
        className={`bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full flex flex-col overflow-hidden border-0 ${
          showAnimation ? 'animate-pulse' : ''
        }`}
      >
        <div className="relative bg-blue-700 p-6">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <FaBalanceScale className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl tracking-wide">
                  SmartLaw AI
                </h3>
                <p className="text-sm text-white/90 flex items-center gap-2 mt-1">
                  Tư vấn pháp luật 24/7
                </p>
              </div>
            </div>
            {onClose && (
              <button
                className="p-3 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                onClick={onClose}
                aria-label="Đóng chat bot"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            )}
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 pb-3 space-y-4 bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 cursor-text"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e5e7eb transparent',
          }}
          onClick={handleChatContainerClick}
        >
          {showQuickOptions && (
            <div className="mb-8 animate-fade-in">
              <div className="grid grid-cols-2 gap-3 mt-5">
                {quickOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickOption(option)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-3 ${option.color}`}
                  >
                    <option.icon className="text-lg" />
                    <span className="text-sm font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={index} className="flex justify-center my-6">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            }

            const hasUsageLimit = item?.text?.includes('Số lượt còn lại');
            let mainMessage = item?.text;
            // lưu phần text liên quan đến "Số lượt còn lại"
            let usageLimitText = '';

            if (hasUsageLimit) {
              const parts = item.text.split('(Số lượt còn lại');
              mainMessage = parts[0].trim();

              if (parts[1]) {
                usageLimitText = '(Số lượt còn lại' + parts[1];
              }
            }
            return (
              <div
                key={index}
                className={`flex items-start gap-3 mt-5 ${
                  item.sender === 'me' ? 'flex-row-reverse' : ''
                } group`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    item.sender === 'me' ? 'bg-gray-600' : 'bg-blue-600'
                  }`}
                >
                  {item.sender === 'me' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaBalanceScale className="text-white text-sm" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] ${item.sender === 'me' ? 'text-right' : ''}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-md ${
                      item.sender === 'me'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {formatMarkdown(mainMessage)}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 px-2 ${
                      item.sender === 'me' ? 'text-right' : ''
                    }`}
                  >
                    {item.time}
                  </div>
                  {hasUsageLimit && (
                    <div
                      className={`text-xs text-gray-400 mt-1 px-2 ${
                        item.sender === 'me' ? 'text-right' : ''
                      }`}
                    >
                      <span className="opacity-70 italic">
                        {usageLimitText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <FaBalanceScale className="text-white text-sm" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="flex gap-3 items-center bg-white rounded-2xl p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="relative group">
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
      ${
        isListening
          ? 'bg-red-500 text-white shadow-lg scale-105 animate-pulse'
          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
      }
      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
                onClick={handleVoiceClick}
                type="button"
                aria-label={isListening ? 'Dừng ghi âm' : 'Ghi âm giọng nói'}
                disabled={isLoading}
                title={isListening ? 'Nhấn để dừng ghi âm' : 'Nhấn để ghi âm'}
              >
                {isListening ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>

              {isListening && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white animate-ping"></div>
              )}
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-500 leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi pháp luật của bạn..."
              rows="1"
              style={{ minHeight: '24px', maxHeight: '120px' }}
              disabled={isLoading}
              autoFocus
            />
            <button
              className={`p-3 rounded-2xl transition-all duration-300 ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              type="button"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperPlane className="text-sm" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
