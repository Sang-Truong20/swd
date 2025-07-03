import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  FaBars,
  FaCircle,
  FaComments,
  FaEllipsisV,
  FaGavel,
  FaPaperPlane,
  FaSearch,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import { chatWithGemini } from '../../services/chat';

const mockConversations = [
  {
    id: 1,
    name: 'Luật sư Phước Sang',
    status: 'online',
    lastMessage: 'Tôi có thể giúp gì về luật giao thông?',
    time: '09:01',
  },
  {
    id: 2,
    name: 'Luật sư Sang Trương',
    status: 'online',
    lastMessage: 'Bạn vui lòng nêu rõ tình huống...',
    time: '10:01',
  },
  {
    id: 3,
    name: 'Luật sư Sang Dev',
    status: 'away',
    lastMessage: 'Tôi sẽ quay lại sau 15 phút',
    time: 'Hôm qua',
  },
];

const initialMessages = {
  1: [
    { sender: 'me', text: 'Xin chào luật sư!', time: '09:00' },
    {
      sender: 'other',
      text: 'Chào bạn! Tôi có thể giúp gì về luật giao thông? Tôi chuyên tư vấn về các vấn đề xử phạt vi phạm, giấy phép lái xe, bảo hiểm và các quy định mới nhất.',
      time: '09:01',
    },
  ],
  2: [
    {
      sender: 'me',
      text: 'Tôi muốn hỏi về quy định vượt đèn đỏ.',
      time: '10:00',
    },
    {
      sender: 'other',
      text: 'Bạn vui lòng nêu rõ tình huống để tôi tư vấn chi tiết. Có phải bạn đã bị xử phạt hay chỉ muốn tìm hiểu quy định?',
      time: '10:01',
    },
  ],
  3: [],
};

const lawQuickOptions = [
  'Quy định vượt đèn đỏ',
  'Bảo hiểm xe bắt buộc',
  'Xử phạt không đội mũ bảo hiểm',
  'Thủ tục cấp lại giấy phép lái xe',
  'Quy định về tai nạn giao thông',
  'Mức phạt nồng độ cồn',
  'Quy định về biển số xe',
];

const ChatBot = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConv, setSelectedConv] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const chatContainerRef = useRef(null);
  const { mutate: chat, isPending } = useMutation({
    mutationFn: chatWithGemini,
    onSuccess: (data) => {
      console.log('check  data', data);
      // navigate('/');
      alert('123');
    },
    onError: (err) => {
      console.error('err', err);
    },
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages, selectedConv]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => ({
      ...prev,
      [selectedConv]: [
        ...(prev[selectedConv] || []),
        { sender: 'me', text: input.trim(), time },
      ],
    }));
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConv
          ? { ...conv, lastMessage: input.trim(), time }
          : conv,
      ),
    );
    setInput('');
    setIsLoading(true);

    try {
      const res = await chatWithGemini(
        input.trim(),
        '2ca20ee0-88b9-4aac-b7a6-21088201b8df',
      );
      const answer =
        res?.data?.answer || res?.data || 'Không nhận được phản hồi từ server.';
      setMessages((prev) => ({
        ...prev,
        [selectedConv]: [
          ...(prev[selectedConv] || []),
          {
            sender: 'other',
            text: answer,
            time: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ],
      }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConv
            ? {
                ...conv,
                lastMessage: answer,
                time: new Date().toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : conv,
        ),
      );
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [selectedConv]: [
          ...(prev[selectedConv] || []),
          {
            sender: 'other',
            text: 'Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại.',
            time: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const selectedLawyer = mockConversations.find((c) => c.id === selectedConv);

  return (
    <div
      className="w-full flex flex-col bg-white"
      style={{ height: 'calc(100vh - 71px)' }}
    >
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-blue-600 border-b border-blue-700">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FaBars className="text-white" />
              </button>

              <div className="relative">
                <div className="p-3 bg-blue-700 rounded-2xl shadow-lg">
                  <FaUserTie className="text-white text-xl" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(selectedLawyer?.status)} rounded-full border-2 border-blue-600`}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl text-white truncate">
                  {selectedLawyer?.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <FaCircle
                    className={`text-xs ${selectedLawyer?.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}
                  />
                  <span>
                    Chuyên gia tư vấn luật giao thông •{' '}
                    {selectedLawyer?.status === 'online'
                      ? 'Đang trực tuyến'
                      : 'Vắng mặt'}
                  </span>
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <FaEllipsisV className="text-blue-100" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 px-6 py-3 bg-blue-50 border-b border-blue-200">
            {lawQuickOptions.map((option, idx) => (
              <button
                key={idx}
                className="px-4 py-2 rounded-2xl bg-white border border-blue-200 text-blue-700 text-sm font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 transition-all duration-150"
                onClick={() => setInput(option)}
                disabled={isLoading}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          {/* Welcome Banner */}
          {showWelcomeBanner && (
            <div className="flex-shrink-0 px-6 py-4 bg-blue-50 border-b border-blue-200 relative">
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="absolute top-4 right-4 p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                title="Ẩn thông báo"
              >
                <svg
                  className="w-4 h-4 text-blue-400 group-hover:text-blue-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div className="flex items-start gap-4 pr-8">
                <div className="p-3 bg-blue-100 shadow-lg rounded-2xl">
                  <FaGavel className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-800 mb-2">
                    🏛️ Dịch vụ tư vấn luật giao thông chuyên nghiệp
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Chào mừng bạn đến với hệ thống tư vấn pháp lý! Chúng tôi
                    cung cấp tư vấn về:
                    <span className="font-semibold text-blue-800">
                      {' '}
                      Vi phạm giao thông, Giấy phép lái xe, Bảo hiểm xe, Tai nạn
                      giao thông, Quy định mới
                    </span>
                    . Hãy mô tả tình huống cụ thể để được hỗ trợ tốt nhất.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50"
            style={{ minHeight: 0 }}
          >
            {(messages[selectedConv] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-4 ${msg.sender === 'me' ? 'flex-row-reverse' : ''} animate-fade-in`}
              >
                <div
                  className={`p-3 rounded-2xl shadow-lg ${msg.sender === 'me' ? 'bg-blue-600' : 'bg-blue-500'}`}
                >
                  {msg.sender === 'me' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaUserTie className="text-white text-sm" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] sm:max-w-[60%] ${msg.sender === 'me' ? 'text-right' : ''}`}
                >
                  <div
                    className={`px-5 py-4 rounded-3xl shadow-lg ${
                      msg.sender === 'me'
                        ? 'bg-blue-500 text-white rounded-br-lg'
                        : 'bg-white text-gray-800 border border-blue-200 rounded-bl-lg'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-2 ${msg.sender === 'me' ? 'text-right' : ''}`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end gap-4 animate-fade-in">
                <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                  <FaUserTie className="text-white text-sm" />
                </div>
                <div className="bg-white border border-blue-200 rounded-3xl rounded-bl-lg px-5 py-4 shadow-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 p-6 bg-white border-t border-blue-200">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full border-2 border-blue-200 rounded-3xl px-6 py-4 pr-12 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-white resize-none transition-all duration-200 placeholder-gray-400 text-gray-700 scrollbar-hide shadow-sm focus:shadow-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Mô tả tình huống hoặc chọn nhanh chủ đề luật giao thông..."
                    rows="1"
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 bottom-4 text-xs text-gray-400">
                    {input.length}/500
                  </div>
                </div>
                <button
                  className={`px-8 py-4 rounded-3xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-3 min-w-[100px] justify-center ${
                    input.trim() && !isLoading
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  type="button"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane className="text-sm" />
                  )}
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>💡 Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
