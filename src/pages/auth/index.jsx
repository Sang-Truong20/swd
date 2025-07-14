import { CarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import Login from './login';
import Register from './register';
import ForgotPassword from './forgot';

function AuthPage() {
  const [formType, setFormType] = useState('login');

  const renderForm = () => {
    switch (formType) {
      case 'login':
        return (
          <Login
            onSwitchToLogin={() => setFormType('register')}
            onForgotPassword={() => setFormType('forgot')}
          />
        );
      case 'register':
        return <Register onSwitchToLogin={() => setFormType('login')} />;
      case 'forgot':
        return <ForgotPassword onSwitchToLogin={() => setFormType('login')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 border-8 border-white rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-60 h-60 border-8 border-white rounded-full translate-x-20 translate-y-20" />
        </div>

        <div className="flex flex-col justify-center px-16 relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <FaBalanceScale className="text-3xl !text-white" />
              </div>
              <div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white leading-tight">
                    Smart
                    <span className="text-yellow-400 drop-shadow-lg">Law</span>
                    <span className="text-blue-200">GT</span>
                  </h1>
                </div>
                <p className="text-blue-200">Tư vấn pháp luật giao thông</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Nền tảng tư vấn pháp luật giao thông hàng đầu Việt Nam
            </h2>
            <p className="text-blue-100 text-lg mb-12">
              Kết nối bạn với các chuyên gia pháp lý uy tín, giải đáp mọi thắc
              mắc về luật giao thông đường bộ
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Tư vấn bởi luật sư có chứng chỉ hành nghề
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Cập nhật văn bản pháp luật mới nhất
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Hỗ trợ 24/7, phản hồi trong 30 phút
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Bảo mật thông tin tuyệt đối
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16">
            <div>
              <p className="text-4xl font-bold text-white">10K+</p>
              <p className="text-blue-200">Khách hàng</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="text-blue-200">Luật sư</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">98%</p>
              <p className="text-blue-200">Hài lòng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <CarOutlined className="text-2xl !text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">SmartLawGT</h1>
            </div>
          </div>

          {renderForm()}

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2025 SmartLawGT. Nền tảng tư vấn pháp luật giao thông.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
