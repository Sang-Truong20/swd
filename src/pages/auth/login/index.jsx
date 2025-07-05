import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import { login } from '../../../services/auth';
import { notify } from '../../../utils';

function Login({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      try {
        const { email, password } = JSON.parse(savedCredentials);
        form.setFieldsValue({
          email,
          password,
          rememberMe: true,
        });
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        localStorage.removeItem('rememberedCredentials');
      }
    }
  }, [form]);

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      notify('success', { description: 'Đăng nhập thành công' });

      const accessToken = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;

      if (accessToken && refreshToken) {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        const decoded = jwtDecode(accessToken);
        const role = decoded['role'];
        if (role === 'ADMIN') {
          navigate(PATH_NAME.ADMIN);
        } else {
          navigate(PATH_NAME.HOME);
        }
        localStorage.setItem('isAuthenticated', true);
      }
    },
    onError: (err) => {
      if (err && err.status === 401) {
        notify('error', { description: 'Thông tin đăng nhập không hợp lệ' });
        return;
      }
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  const handleSubmit = async (values) => {
    if (values.rememberMe) {
      const credentialsToSave = {
        email: values.email,
        password: values.password,
      };
      localStorage.setItem(
        'rememberedCredentials',
        JSON.stringify(credentialsToSave),
      );
    } else {
      localStorage.removeItem('rememberedCredentials');
    }

    loginMutate(values);
  };

  return (
    <div className="bg-white relative rounded-2xl shadow-xl p-5 md:p-8">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-b-full" />
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SafetyOutlined className="text-3xl text-blue-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập tài khoản
        </h2>
        <p className="text-gray-600">
          Truy cập dịch vụ tư vấn pháp luật giao thông
        </p>
        <p
          onClick={() => navigate('/')}
          className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
        >
          Quay về trang chủ
        </p>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ rememberMe: false }}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email hoặc số điện thoại',
            },
            { min: 8, message: 'Tối thiểu 8 ký tự' },
          ]}
          className="mb-5"
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email hoặc số điện thoại"
            autoFocus
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
          ]}
          className="mb-2"
        >
          <Input
            prefix={<LockOutlined className="text-gray-400" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
            suffix={
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            }
          />
        </Form.Item>
        <div className="flex items-center justify-between mb-6">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox className="text-gray-600">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-blue-900 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          className="w-full !h-12 !text-base !font-semibold !border-0 !rounded-lg"
          size="large"
        >
          Đăng nhập
        </Button>
        <div className="mt-4 flex items-center justify-center text-center">
          <div className="mr-2 h-[1px] w-full bg-[#e6e8eb]"></div>
          <span className="text-[#999999]">hoặc</span>
          <div className="ml-2 h-[1px] w-full bg-[#e6e8eb]"></div>
        </div>
        <Button className="mx-auto mt-5 block !h-12 w-full rounded-[5px] border border-gray-300 py-5 bg-[#fff] text-[grey] shadow-none hover:!border-primary hover:!bg-transparent hover:!text-primary">
          <div className="flex items-center justify-center tracking-wider">
            <img
              src="https://freesvg.org/img/1534129544.png"
              width={30}
              height={30}
              alt=""
              className="mr-2"
            />
            Tiếp tục với Google
          </div>
        </Button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
          <Link
            className="text-blue-900 hover:text-blue-800 font-semibold transition-colors"
            onClick={onSwitchToLogin}
          >
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
