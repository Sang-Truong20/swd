import { Form, Input, Button, Card, message } from 'antd';
import { useState } from 'react';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log('values', values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h2>
        <p className="text-gray-600 mt-2">
          Cập nhật mật khẩu để bảo mật tài khoản
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-md space-y-4"
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Mật khẩu xác nhận không khớp!'),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
        <div className="pt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Đổi mật khẩu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
