import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = (values) => {
    console.log('Register data:', values);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-b-full" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <UserOutlined className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h1>
            <p className="text-gray-600 text-sm">Tạo tài khoản mới</p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="fullname"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 3, message: 'Họ và tên tối thiểu 3 ký tự' },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng',
                },
              ]}
              className="[&_.ant-form-item-explain]:text-left mb-4"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Họ và tên"
                autoFocus
                className="!py-2"
              />
            </Form.Item>

            <Form.Item
              name="usernameOrEmail"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập hoặc email!',
                },
                { min: 8, message: 'Tên đăng nhập tối thiểu 8 ký tự' },
                {
                  pattern: /^[a-zA-Z0-9._@]+$/,
                  message:
                    'Tên đăng nhập chỉ được chứa chữ cái, số và ký tự . _ @',
                },
              ]}
              className="[&_.ant-form-item-explain]:text-left mb-4"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Tên đăng nhập hoặc Email"
                className="!py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message:
                    'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
                },
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

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu xác nhận không khớp!'),
                    );
                  },
                }),
              ]}
              className="[&_.ant-form-item-explain]:text-left mb-4"
            >
              <Input
                prefix={<LockOutlined />}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className="!py-2"
                suffix={
                  <div
                    onClick={toggleConfirmPassword}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeOutlined />
                    )}
                  </div>
                }
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full !h-10 !text-base !font-medium mb-4"
              size="large"
            >
              Đăng ký
            </Button>

            <div className="text-center">
              <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Đăng nhập ngay
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

export default RegisterPage;
