import { useMutation } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import UploadImage from '../../components/UploadImage';
import { useUserData } from '../../hooks/useUserData';
import { updateUserInfo } from '../../services/user';
import { notify } from '../../utils';

const MemberInfo = () => {
  const [form] = Form.useForm();
  const userId = localStorage.getItem('userId');
  const [fileChange, setFileChange] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { userInfo, refetch } = useUserData();

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        ...userInfo,
        birthday: userInfo.birthday ? dayjs(userInfo.birthday) : null,
        avatarUrlText: fileChange,
      });
    }
  }, [userInfo, fileChange, form]);

  const { mutate: mutateUpdateUserInfo, isPending } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      notify('success', {
        description: 'Cập nhật thông tin người dùng thành công',
      });
      refetch();
    },
    onError: () => {
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  const onFinish = (values) => {
    // eslint-disable-next-line no-unused-vars
    const { userName, email, ...rest } = values;

    const payload = {
      ...rest,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
    };

    mutateUpdateUserInfo({ payload, userId });
  };

  const handleFileChange = useCallback((newFileChange) => {
    setFileChange(newFileChange);
  }, []);

  const normalizedInitialValues = useMemo(() => {
    if (!userInfo) return {};

    return {
      ...userInfo,
      birthday:
        userInfo.birthday && dayjs(userInfo.birthday).isValid()
          ? dayjs(userInfo.birthday)
          : null,
    };
  }, [userInfo]);

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
        initialValues={normalizedInitialValues}
        onFinish={onFinish}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              ]}
            >
              <Input
                className="!py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                placeholder="Nhập tên đăng nhập"
                readOnly
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
                readOnly
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
          </div>

          <div className="space-y-4">
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              normalize={(value) => {
                // Normalize giá trị để đảm bảo nó luôn là dayjs object
                if (!value) return null;
                if (dayjs.isDayjs(value)) return value;
                return dayjs(value).isValid() ? dayjs(value) : null;
              }}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                format="YYYY/MM/DD"
                size="large"
                className="w-full !py-3 !px-4 !text-base !rounded-lg !border-gray-300 focus:!border-blue-500"
                disabledDate={(current) => {
                  return current && current >= dayjs().startOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              name="avatarUrlText"
              // rules={[{ required: true, message: 'Vui lòng chọn hình ảnh' }]}
              className="flex w-full items-center justify-center"
            >
              <div className="flex w-full flex-col items-center">
                <UploadImage
                  titleButton="Thêm ảnh"
                  initialImage={userInfo?.avatarUrlText ?? ''}
                  onFileChange={handleFileChange}
                  onUploadingChange={(status) => setIsUploading(status)}
                />
              </div>
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-start pt-8 border-t border-gray-200 mt-8">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending || isUploading}
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
