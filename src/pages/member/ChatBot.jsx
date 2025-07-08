import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBalanceScale, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa';
import { chatWithGemini, getChatHistory } from '../../services/chat';
import { formatDateChatBot, getDateKey } from '../../utils/index';
import { quickOptions } from './constants/index';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const userId = localStorage.getItem('userId');

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

  const transformedMessages = useMemo(() => {
    const groupedMessages = [];
    let lastDateKey = null;

    const sortedMessages = [...listMessage].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    sortedMessages.forEach((msg) => {
      const dateKey = getDateKey(msg.timestamp);
      const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (dateKey !== lastDateKey) {
        groupedMessages.push({
          type: 'date',
          date: formatDateChatBot(msg.timestamp),
          timestamp: msg.timestamp,
        });
        lastDateKey = dateKey;
      }

      groupedMessages.push({
        type: 'message',
        sender: 'me',
        text: msg.question,
        time,
        timestamp: msg.timestamp,
      });

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

  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

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

  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [messages, isInitialized]);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => {
      setShowAnimation(false);
      focusTextarea();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = async (message = input) => {
    if (!message.trim() || isLoading) return;

    setHasUserSentMessage(true);

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const lastMessage = messages[messages.length - 1];
    const needDateSeparator =
      lastMessage &&
      getDateKey(now.toISOString()) !== getDateKey(lastMessage.timestamp);

    const newMessages = [...messages];

    if (needDateSeparator) {
      newMessages.push({
        type: 'date',
        date: formatDateChatBot(now.toISOString()),
        timestamp: now.toISOString(),
      });
    }

    newMessages.push({
      type: 'message',
      sender: 'me',
      text: message.trim(),
      time,
      timestamp: now.toISOString(),
    });

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    setTimeout(() => {
      focusTextarea();
    }, 10);

    try {
      const res = await chatWithGemini(message.trim(), userId);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const answer =
        res?.data?.answer ||
        res?.data ||
        'Không nhận được phản hồi từ hệ thống';

      setIsTyping(false);
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

  const handleQuickOption = (option) => {
    handleSend(option.query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChatContainerClick = () => {
    if (!isLoading) {
      focusTextarea();
    }
  };

  const showQuickOptions = !hasUserSentMessage;

  return (
    <div className="w-full h-full max-w-4xl mx-auto">
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full h-full flex flex-col overflow-hidden border-0 ${
          showAnimation ? 'animate-pulse' : ''
        }`}
      >
        <div className="relative bg-blue-700 p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
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

          {messages.map((item, idx) => {
            if (item.type === 'date') {
              return (
                <div key={idx} className="flex justify-center my-6">
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
            let usageLimitText = '';

            if (hasUsageLimit) {
              const parts = item.text.split('(Số lượt còn lại');
              mainMessage = parts[0].trim();
              if (parts[1]) {
                usageLimitText = 'Số lượt còn lại' + parts[1].replace(')', '');
              }
            }

            return (
              <div
                key={idx}
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
                      {mainMessage}
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
                        ({usageLimitText})
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
