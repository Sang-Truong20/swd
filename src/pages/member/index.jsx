import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Thông tin cơ bản', path: 'info' },
  { label: 'Đổi mật khẩu', path: 'change-password' },
  { label: 'Quản lý package', path: 'package' },
];

const MemberPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/member' || location.pathname === '/member/') {
      navigate('info', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg">
      <div className="flex border-b mb-6 gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-5 py-2 -mb-px border-b-2 font-semibold text-base transition-colors duration-200 rounded-t-lg ${
                isActive
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-blue-500 hover:bg-gray-100'
              }`
            }
            end
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberPage;
