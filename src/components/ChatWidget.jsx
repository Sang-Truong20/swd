import { memo, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants';
import { useUserData } from '../hooks/useUserData';
import ChatBot from '../pages/member/ChatBot';
import { notify } from '../utils';

const ChatWidget = ({ hasPackage = true }) => {
  const [open, setOpen] = useState(false);
  const { userInfo } = useUserData();
  const navigate = useNavigate();

  const handleOpen = () => {
    if (!userInfo) {
      navigate(PATH_NAME.AUTH);
      notify('info', {
        description: 'Vui lòng đăng nhập trước khi sử dụng dịch vụ',
      });
      return;
    }

    if (hasPackage) {
      setOpen(true);
    } else {
      window.alert('Bạn cần mua gói dịch vụ để sử dụng chat bot!');
    }
  };

  return (
    <div>
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 border-2 border-white"
          onClick={handleOpen}
          aria-label="Mở chat bot"
        >
          <FaComments className="text-white text-3xl drop-shadow-lg" />
        </button>
      )}
      <div
        className={`fixed bottom-6 right-6 z-50 w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in transition-all duration-300 ${
          open ? '' : 'hidden'
        }`}
        style={{ height: '80vh', maxHeight: 800 }}
      >
        <div className="flex-1 min-h-0">
          <ChatBot onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatWidget);
