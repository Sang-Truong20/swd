import { Button, DatePicker, Form, Input, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const initialUser = {
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

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
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
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>
        </div>
        <div className="space-y-4">
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
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
        <div className="md:col-span-2 pt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Cập nhật thông tin
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MemberInfo;
