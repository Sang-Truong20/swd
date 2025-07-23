import { memo, useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants';
import { useUserData } from '../hooks/useUserData';
import ChatBot from '../pages/member/ChatBot';
import { notify } from '../utils';

const ChatWidget = ({ hasPackage = true }) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const { userInfo } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const isMobile = width <= 640;

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
      notify('info', {
        description: 'Vui lòng mua gói để sử dụng dịch vụ',
      });
      navigate('/', { replace: true });
      setTimeout(() => {
        const el = document.getElementById('packages-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
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
        className={`fixed z-50 transition-all duration-300 ${open ? '' : 'hidden'}
                w-full max-w-md sm:max-w-md h-[70vh] max-h-[800px] bottom-6 right-6 rounded-none shadow-2xl border border-gray-200 flex flex-col overflow-hidden
                sm:bottom-6 sm:right-6 sm:rounded-3xl sm:w-full sm:h-[70vh] sm:max-h-[800px]
                mobile:inset-0 mobile:w-full mobile:h-full mobile:rounded-none mobile:max-w-none mobile:max-h-none
              `}
        style={{
          ...(isMobile
            ? {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                maxWidth: 'none',
                maxHeight: 'none',
              }
            : {}),
        }}
      >
        <div className="flex-1 min-h-0">
          <ChatBot onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatWidget);
