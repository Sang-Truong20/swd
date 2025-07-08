import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import { changePassword } from '../../services/user';
import { notify } from '../../utils';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const userId = localStorage.getItem('userId');

  const { mutate: mutateChangePassword, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      notify('success', { description: 'Đổi mật khẩu thành công' });
    },
    onError: () => {
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  const onFinish = (values) => {
    if (!values) return;

    const payload = {
      userId,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    mutateChangePassword(payload);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
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
          name="oldPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
          ]}
        >
          <Input.Password
            className="!py-3 !px-4 !text-base !rounded-lg"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          ]}
        >
          <Input.Password
            className="!py-3 !px-4 !text-base !rounded-lg"
            placeholder="Nhập mật khẩu mới"
          />
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
          <Input.Password
            className="!py-3 !px-4 !text-base !rounded-lg"
            placeholder="Xác nhận mật khẩu mới"
          />
        </Form.Item>
        <div className="flex justify-start pt-8 border-t border-gray-200 mt-8">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            size="large"
            className="!h-12 !px-8 !text-base !font-semibold !rounded-lg !bg-blue-600 hover:!bg-blue-700 !border-0 !shadow-md hover:!shadow-lg transition-all duration-200"
          >
            Đổi mật khẩu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
