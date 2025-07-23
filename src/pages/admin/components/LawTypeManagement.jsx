import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Popconfirm, 
  message, 
  Modal, 
  Form,
  Card,
  Row,
  Col,
  Statistic,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  TagOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { lawTypeService } from '../services/adminService';
import dayjs from 'dayjs';

const LawTypeManagement = () => {
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLawType, setEditingLawType] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadLawTypes();
  }, []);

  const loadLawTypes = async () => {
    setLoading(true);
    try {
      const response = await lawTypeService.getAllLawTypes();
      const types = Array.isArray(response) ? response : [];
      setLawTypes(types);
    } catch (error) {
      message.error('Không thể tải danh sách loại văn bản: ' + error.message);
      setLawTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadLawTypes();
      return;
    }

    setLoading(true);
    try {
      const response = await lawTypeService.searchLawTypes(searchText);
      const types = Array.isArray(response) ? response : [];
      setLawTypes(types);
    } catch (error) {
      message.error('Tìm kiếm thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLawType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingLawType(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (lawTypeId) => {
    try {
      await lawTypeService.deleteLawType(lawTypeId);
      message.success('Xóa loại văn bản thành công');
      loadLawTypes();
    } catch (error) {
      message.error('Xóa loại văn bản thất bại: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLawType) {
        await lawTypeService.updateLawType(editingLawType.lawTypeId, values);
        message.success('Cập nhật loại văn bản thành công');
      } else {
        await lawTypeService.createLawType(values);
        message.success('Tạo loại văn bản thành công');
      }

      setIsModalVisible(false);
      loadLawTypes();
    } catch (error) {
      message.error((editingLawType ? 'Cập nhật' : 'Tạo') + ' loại văn bản thất bại: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Tên loại văn bản',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text) => (
        <div className="flex items-center">
          <TagOutlined className="mr-2 text-blue-600" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng văn bản',
      dataIndex: 'lawCount',
      key: 'lawCount',
      width: 150,
      render: (count) => (
        <Tag color="blue" icon={<FileTextOutlined />}>
          {count || 0} văn bản
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 120,
      render: (date) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-1 text-gray-500" />
          {date ? dayjs(date).format('DD/MM/YYYY') : '---'}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      render: (isDeleted) => (
        <Tag color={isDeleted ? 'red' : 'green'}>
          {isDeleted ? 'Đã xóa' : 'Hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.isDeleted}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa loại văn bản này?"
            description="Thao tác này sẽ ảnh hưởng đến các văn bản thuộc loại này."
            onConfirm={() => handleDelete(record.lawTypeId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.isDeleted}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeTypes = lawTypes.filter(type => !type.isDeleted);
  const totalLaws = lawTypes.reduce((sum, type) => sum + (type.lawCount || 0), 0);

  return (
    <div className="p-6">
      <Card 
        title={
          <div className="flex items-center">
            <TagOutlined className="mr-2 text-blue-600" />
            <span>Quản lý Loại Văn bản</span>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo loại văn bản mới
          </Button>
        }
      >
        {/* Statistics */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Tổng số loại văn bản"
                value={lawTypes.length}
                prefix={<TagOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Loại văn bản hoạt động"
                value={activeTypes.length}
                prefix={<TagOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Tổng số văn bản"
                value={totalLaws}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search Section */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={16} md={18}>
            <Input
              placeholder="Tìm kiếm theo tên loại văn bản..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button 
                onClick={() => {
                  setSearchText('');
                  loadLawTypes();
                }}
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={lawTypes}
          loading={loading}
          rowKey="lawTypeId"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} loại văn bản`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingLawType ? 'Chỉnh sửa loại văn bản' : 'Tạo loại văn bản mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên loại văn bản"
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại văn bản' },
              { min: 2, message: 'Tên loại văn bản phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên loại văn bản không được quá 100 ký tự' }
            ]}
          >
            <Input 
              placeholder="Ví dụ: Luật, Nghị định, Thông tư..."
              autoFocus
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingLawType ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LawTypeManagement;
