import { useState } from 'react';
import { Form, Input, Button, message, Card, Row, Col } from 'antd';

const initialUser = {
  email: 'user@email.com',
  name: 'Nguyễn Văn A',
  birthday: '01/01/1990',
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
    <Card
      title={
        <span className="text-xl font-bold text-blue-700">
          Thông tin cơ bản
        </span>
      }
      bordered={false}
      className="shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={user}
        onFinish={onFinish}
        size="large"
        className="pt-2"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input disabled className="bg-gray-100" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
            >
              <Input placeholder="dd/mm/yyyy" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="text-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-8 py-2 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
            style={{
              boxShadow: '0 4px 16px 0 rgba(56, 189, 248, 0.10)',
            }}
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MemberInfo;
