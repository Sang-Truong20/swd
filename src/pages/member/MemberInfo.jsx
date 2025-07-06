import { Button, DatePicker, Form, Input, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import UploadImage from '../../components/UploadImage';

const initialUser = {
  username: 'admin',
  email: 'user@email.com',
  name: 'Nguyễn Văn A',
  birthday: '',
  address: 'Hà Nội',
  phone: '0123456789',
};

const MemberInfo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialUser);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setUser(values);
      setLoading(false);
      message.success('Cập nhật thông tin thành công!');
    }, 1200);
  };

  const onFileChange = () => {
    console.log('123');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cơ bản</h2>
        <p className="text-gray-600 mt-2">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={user}
        onFinish={onFinish}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              ]}
            >
              <Input
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                defaultValue={'admin'}
                placeholder="Nhập tên đăng nhập"
              />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                placeholder="Nhập họ và tên"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Vui lòng nhập email hợp lệ',
                },
              ]}
            >
              <Input
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                placeholder="example@email.com"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
              ]}
            >
              <Input
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                placeholder="0123456789"
              />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
                size="large"
                className="w-full !py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                disabledDate={(current) => {
                  return current && current >= dayjs().startOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập địa chỉ đầy đủ"
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500 !resize-none"
              />
            </Form.Item>

            <div className="mt-6">
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <UploadImage
                onFileChange={onFileChange}
                initialImage={''}
                titleButton="Tải lên ảnh"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-start pt-8 border-t border-gray-200 mt-8">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="!h-12 !px-8 !text-base !font-semibold !rounded-lg !bg-blue-600 hover:!bg-blue-700 !border-0 !shadow-md hover:!shadow-lg transition-all duration-200"
          >
            Cập nhật thông tin
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MemberInfo;
