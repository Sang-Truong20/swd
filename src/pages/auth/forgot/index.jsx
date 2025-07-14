import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  receiveOTP,
  resetPassword,
  verifyAccount,
} from '../../../services/auth';
import { notify } from '../../../utils';

const ForgotPassword = ({ onSwitchToLogin }) => {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const [otpDrawerOpen, setOtpDrawerOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('otp');
  const { email } = form.getFieldsValue();

  // B1: gửi email -> nhận OTP
  const { mutate: mutateReceiveOtp, isPending: isLoadingReceiveOtp } =
    useMutation({
      mutationFn: receiveOTP,
      onSuccess: () => {
        setOtpDrawerOpen(true);
        setStep('otp');
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

  // B2: xác minh OTP
  const { mutate: mutateVerifyAccount, isPending: isLoadingVerifyAccount } =
    useMutation({
      mutationFn: verifyAccount,
      onSuccess: () => {
        setOtp('');
        setStep('resetPassword');
      },
      onError: (err) => {
        if (err.response && err.response.data === 'OTP invalid or expired') {
          notify('error', { description: 'OTP không hợp lệ hoặc đã hết hạn' });
          return;
        }
        notify('error', { description: err.response.data });
      },
    });

  // B3: đặt lại mật khẩu
  const { mutate: mutateResetPassword, isPending: isLoadingResetPassword } =
    useMutation({
      mutationFn: resetPassword,
      onSuccess: () => {
        notify('success', {
          description: 'Mật khẩu đã được cập nhật thành công',
        });
        setOtp('');
        setStep('otp');
        setOtpDrawerOpen(false);
        resetPasswordForm.resetFields();
        onSwitchToLogin();
      },
      onError: () => {
        notify('error', { description: 'Lỗi hệ thống' });
      },
    });

  const handleOtpConfirm = () => {
    if (otp.length !== 6) {
      notify('info', { description: 'Mã OTP phải có 6 chữ số' });
      return;
    }
    const payload = {
      email,
      otp,
    };
    mutateVerifyAccount(payload);
  };

  const handleReceiveOtp = (values) => {
    mutateReceiveOtp(values.email);
  };

  const handleResetPassword = (values) => {
    mutateResetPassword({
      email: email,
      newPassword: values.newPassword,
    });
  };

  const handleCloseDrawer = () => {
    setOtpDrawerOpen(false);
    setStep('otp');
    setOtp('');
    resetPasswordForm.resetFields();
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
          onFinish={handleReceiveOtp}
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

      {/* xử lý overlay cho form OTP */}
      <Drawer
        title={null}
        placement="bottom"
        onClose={handleCloseDrawer}
        open={otpDrawerOpen}
        closable={false}
        height={step === 'otp' ? 270 : 350}
        style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
        <div className="flex flex-col h-full justify-center items-center text-left">
          <div className="max-w-md mx-auto w-full">
            {step === 'otp' && (
              <>
                <Title level={4} className="!mb-0">
                  Nhập mã OTP 6 số
                </Title>
                <Text type="secondary">
                  Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra
                  và nhập mã bên dưới
                </Text>
                <div className="flex flex-col justify-center items-center m-4 gap-5">
                  <Input.OTP
                    autoFocus
                    length={6}
                    size="large"
                    id="custom-otp"
                    className="w-full"
                    value={otp}
                    formatter={(str) => str.toUpperCase()}
                    onChange={(value) => setOtp(value)}
                  />

                  <Button
                    type="primary"
                    className="w-full !h-12 !text-base !font-semibold !border-0 !rounded-lg"
                    size="large"
                    loading={isLoadingVerifyAccount}
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
              </>
            )}

            {step === 'resetPassword' && (
              <>
                <Title level={4} className="!mb-0">
                  Đặt lại mật khẩu
                </Title>
                <Text type="secondary">Vui lòng nhập mật khẩu mới của bạn</Text>
                <div className="flex justify-center items-center m-4">
                  <Form
                    form={resetPasswordForm}
                    onFinish={handleResetPassword}
                    layout="vertical"
                    className="mt-4 w-full"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="newPassword"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu mới',
                        },
                        {
                          min: 6,
                          message: 'Mật khẩu phải có ít nhất 6 ký tự',
                        },
                      ]}
                      className="mb-4"
                    >
                      <Input.Password
                        autoFocus
                        prefix={<LockOutlined className="text-gray-400" />}
                        rules={[
                          { required: true, message: 'Vui lòng nhập mật khẩu' },
                          { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                          {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                            message:
                              'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
                          },
                        ]}
                        placeholder="Mật khẩu mới"
                        size="large"
                        className="!py-3 !px-4 !text-base !rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      required
                      dependencies={['newPassword']}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng xác nhận mật khẩu',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue('newPassword') === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('Mật khẩu xác nhận không khớp'),
                            );
                          },
                        }),
                      ]}
                      className="mb-4"
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Xác nhận mật khẩu"
                        size="large"
                        className="!py-3 !px-4 !text-base !rounded-lg"
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full !h-12 !text-base !font-semibold !border-0 !rounded-lg"
                      size="large"
                      loading={isLoadingResetPassword}
                    >
                      Đặt lại mật khẩu
                    </Button>
                  </Form>
                </div>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ForgotPassword;
