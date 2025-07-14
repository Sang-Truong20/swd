import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { receiveOTP } from '../../../services/auth';
import { notify } from '../../../utils';

const ForgotPassword = ({ onSwitchToLogin }) => {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [otpDrawerOpen, setOtpDrawerOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading] = useState(false);

  const { mutate: mutateReceiveOtp, isPending: isLoadingReceiveOtp } =
    useMutation({
      mutationFn: receiveOTP,
      onSuccess: () => {
        setOtpDrawerOpen(true);
        notify('success', {
          description:
            'Mã OTP đã được gửi. Vui lòng kiểm tra hòm thư (hoặc Thư rác) để lấy mã OTP',
        });
        setOtp('');
      },
      onError: () => {
        notify('error', { description: 'Lỗi hệ thống' });
      },
    });

  const handleOtpConfirm = () => {};

  const handleSubmit = (values) => {
    mutateReceiveOtp(values.email);
  };

  return (
    <div>
      <div className="bg-white relative rounded-2xl shadow-xl p-5 md:p-8">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-b-full" />
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LockOutlined className="text-3xl text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Khôi phục mật khẩu
          </h1>
          <p className="text-gray-600">
            Vui lòng nhập địa chỉ email để nhận hướng dẫn đặt lại mật khẩu.
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
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
              {
                type: 'email',
                message: 'Email không hợp lệ',
              },
            ]}
            className="mb-5"
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              autoFocus
              size="large"
              className="!py-3 !px-4 !text-base !rounded-lg"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full !h-12 !text-base !font-semibold !border-0 !rounded-lg"
            size="large"
            loading={isLoadingReceiveOtp}
          >
            Gửi
          </Button>
          <div className="mt-4 flex items-center justify-center text-center">
            <div className="mr-2 h-[1px] w-full bg-[#e6e8eb]"></div>
            <span className="text-[#999999]">hoặc</span>
            <div className="ml-2 h-[1px] w-full bg-[#e6e8eb]"></div>
          </div>

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
      <Drawer
        title={null}
        placement="bottom"
        onClose={() => setOtpDrawerOpen(false)}
        open={otpDrawerOpen}
        closable={false}
        height={270}
        style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
        <div className="flex flex-col h-full justify-center items-center text-left">
          <div className="max-w-xl mx-auto">
            <Title level={4} className="!mb-0">
              Nhập mã OTP 6 số
            </Title>
            <Text type="secondary">
              Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và
              nhập mã bên dưới
            </Text>
            <div className="flex justify-center items-center m-4">
              <Input.OTP
                autoFocus
                length={5}
                size="large"
                id="custom-otp"
                className="w-full"
                value={otp}
                formatter={(str) => str.toUpperCase()}
                onChange={(value) => setOtp(value)}
              />
            </div>

            <Button
              type="primary"
              className="mt-4 w-full"
              size="large"
              loading={otpLoading}
              onClick={handleOtpConfirm}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleOtpConfirm();
                }
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ForgotPassword;
