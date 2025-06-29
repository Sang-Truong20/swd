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
    <Card
      title={
        <span className="text-xl font-bold text-blue-700">Đổi mật khẩu</span>
      }
      bordered={false}
      className="shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
      style={{ maxWidth: 480, margin: '0 auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        className="pt-2"
      >
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu cũ"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Mật khẩu nhập lại không khớp!'),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item className="text-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-8 py-2 rounded-xl text-base font-semibold border-0"
            style={{
              boxShadow: '0 4px 16px 0 rgba(56, 189, 248, 0.10)',
            }}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
        <p className="text-amber-800 text-sm">
          <strong>Lưu ý:</strong> Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm
          chữ hoa, chữ thường và số.
        </p>
      </div>
    </Card>
  );
};

export default ChangePassword;
