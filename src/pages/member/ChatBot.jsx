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

const ChatBot = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConv, setSelectedConv] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages, selectedConv]);

  const handleSend = () => {
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

    setTimeout(
      () => {
        const responses = [
          'Cảm ơn bạn đã gửi câu hỏi. Theo Nghị định 100/2019/NĐ-CP, tôi sẽ phân tích chi tiết cho bạn.',
          'Đây là vấn đề quan trọng trong luật giao thông. Dựa trên quy định hiện hành, tôi khuyên bạn nên...',
          'Tôi hiểu tình huống của bạn. Theo Luật Giao thông đường bộ 2008 (sửa đổi 2012), vấn đề này được quy định như sau...',
          'Dựa trên kinh nghiệm tư vấn, trường hợp của bạn thuộc diện cần xem xét kỹ. Hãy cung cấp thêm thông tin để tôi tư vấn chính xác nhất.',
          'Theo quy định mới nhất, tôi sẽ hướng dẫn bạn từng bước để giải quyết vấn đề này một cách hiệu quả.',
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        setMessages((prev) => ({
          ...prev,
          [selectedConv]: [
            ...(prev[selectedConv] || []),
            {
              sender: 'other',
              text: randomResponse,
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
                  lastMessage: randomResponse,
                  time: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }
              : conv,
          ),
        );
        setIsLoading(false);
      },
      1500 + Math.random() * 1000,
    );
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
        <div
          className={`${isSidebarOpen ? 'w-80' : 'w-0'} lg:w-80 bg-blue-50 border-r border-blue-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:flex'} flex-shrink-0`}
        >
          <div className="p-4 border-b border-blue-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm luật sư..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4">
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <FaComments className="text-blue-600" />
                Chuyên gia trực tuyến (
                {mockConversations.filter((c) => c.status === 'online').length})
              </h3>

              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedConv === conv.id
                        ? 'bg-blue-100 border border-blue-300 shadow-md'
                        : 'hover:bg-blue-50 border border-transparent hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedConv(conv.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div
                          className={`p-3 rounded-full ${selectedConv === conv.id ? 'bg-blue-600' : 'bg-blue-500'} transition-all shadow-md`}
                        >
                          <FaUserTie className="text-white text-sm" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(conv.status)} rounded-full border-2 border-white`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800 truncate text-sm">
                            {conv.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {conv.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate leading-relaxed">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <FaCircle
                            className={`text-xs ${conv.status === 'online' ? 'text-green-500' : 'text-yellow-500'}`}
                          />
                          <span className="text-xs text-gray-500 capitalize">
                            {conv.status === 'online'
                              ? 'Trực tuyến'
                              : 'Vắng mặt'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <textarea
                  className="w-full border-2 border-blue-200 rounded-3xl px-6 py-4 pr-12 outline-none focus:ring-[0.5px] focus:ring-blue-500 focus:border-blue-500 bg-white resize-none transition-all duration-200 placeholder-gray-400 text-gray-700 scrollbar-hide"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Mô tả tình huống hoặc đặt câu hỏi về luật giao thông..."
                  rows="1"
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
                <div className="absolute right-4 bottom-4 text-xs text-gray-400">
                  {input.length}/500
                </div>
              </div>
              <button
                className={`px-8 py-4 rounded-3xl  font-semibold shadow-lg transition-all duration-200 flex items-center gap-3 min-w-[100px] justify-center ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <FaPaperPlane className="text-sm" />
                )}
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>💡 Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
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
