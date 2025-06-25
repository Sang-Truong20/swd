import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (values) => {
    console.log('Login data:', values);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-b-full" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <LockOutlined className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600 text-sm">Chào mừng bạn trở lại!</p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ rememberMe: false }}
          >
            <Form.Item
              name="usernameOrEmail"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 8, message: 'Tên đăng nhập tối thiểu 8 ký tự' },
              ]}
              className="[&_.ant-form-item-explain]:text-left mb-4"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
                autoFocus
                className="!py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
              ]}
              className="[&_.ant-form-item-explain]:text-left mb-4"
            >
              <Input
                prefix={<LockOutlined />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="!py-2"
                suffix={
                  <div onClick={togglePassword} className="cursor-pointer">
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </div>
                }
              />
            </Form.Item>

            <div className="mb-5">
              <div className="flex items-center justify-between">
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link
                  to="#"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full !h-10 !text-base !font-medium"
              size="large"
            >
              Đăng nhập
            </Button>

            <div className="text-center mt-5">
              <span className="text-gray-600 text-sm">Chưa có tài khoản? </span>
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </div>

        <div className="text-center mt-4 text-xs text-gray-500">
          © 2025 FPTU. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
