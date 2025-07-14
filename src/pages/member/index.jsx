import { ChevronRight, Lock, Package, User } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';

const tabs = [
  { label: 'Thông tin cơ bản', path: 'info', icon: User },
  { label: 'Đổi mật khẩu', path: 'change-password', icon: Lock },
  { label: 'Quản lý package', path: 'package', icon: Package },
];

// xứ lý layout để tránh render lại toàn bộ component khi chuyển tab
const MemberPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop() || 'info';
  const { userInfo } = useUserData();

  const handleTabClick = (path) => {
    navigate(`/member/${path}`);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 mb-20 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {userInfo.name}
                </h2>
                <p className="text-sm text-gray-600">Quản lý tài khoản</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.path}
                    onClick={() => handleTabClick(tab.path)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-left font-medium text-base transition-all duration-200 rounded-lg group ${
                      currentPath === tab.path
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        currentPath === tab.path
                          ? 'lg:rotate-0 rotate-90'
                          : 'group-hover:translate-x-1'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
