import {
  EyeInvisibleOutlined,
  EyeOutlined,
  FileSearchOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../../services/auth';
import { notify } from '../../../utils';

function Register({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: registerMutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      notify('success', { description: 'Đăng ký tài khoản thành công' });
      onSwitchToLogin();
    },
    onError: (err) => {
      if (err && err.status === 401) {
        notify('error', { description: 'Thông tin đăng ký không hợp lệ' });
        return;
      }
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (values) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...rest } = values;

    const payload = {
      ...rest,
      birthday: values.birthday.format('YYYY-MM-DD'),
    };

    registerMutate(payload);
  };

  return (
    <div className="bg-white relative rounded-2xl shadow-xl p-5 md:p-8">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-b-full" />

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UserAddOutlined className="text-3xl text-blue-900" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h1>
        <p className="text-gray-600">
          Chào mừng đến với dịch vụ tư vấn pháp luật giao thông
        </p>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên đăng nhập',
            },
            { min: 8, message: 'Tên đăng nhập tối thiểu 8 ký tự' },
            {
              pattern: /^[a-zA-Z0-9._@]+$/,
              message: 'Tên đăng nhập chỉ được chứa chữ cái, số và ký tự',
            },
          ]}
          className="[&_.ant-form-item-explain]:text-left mb-4"
        >
          <Input
            prefix={<FileSearchOutlined />}
            placeholder="Tên đăng nhập"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
            {
              type: 'email',
              message: 'Email không hợp lệ!',
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên' },
              { min: 3, message: 'Họ và tên tối thiểu 3 ký tự' },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng',
              },
            ]}
            className="flex-1 [&_.ant-form-item-explain]:text-left"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Họ và tên"
              autoFocus
              size="large"
              className="!py-3 !px-4 !text-base !rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="birthday"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            className="w-[40%] [&_.ant-form-item-explain]:text-left"
          >
            <DatePicker
              placeholder="Ngày sinh"
              format="YYYY/MM/DD"
              size="large"
              className="w-full !py-3 !px-4 !text-base !rounded-lg"
              disabledDate={(current) => {
                return current && current >= dayjs().startOf('day');
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
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
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
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
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
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
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
            suffix={
              <div onClick={toggleConfirmPassword} className="cursor-pointer">
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
          loading={isPending}
          className="w-full mt-5 flex justify-center items-center !h-12 !text-lg !font-semibold !border-0 !rounded-lg"
          size="large"
        >
          Đăng ký
        </Button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Link
            className="text-blue-900 hover:text-blue-800 font-semibold transition-colors"
            onClick={onSwitchToLogin}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Register;
