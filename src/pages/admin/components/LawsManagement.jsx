import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  DatePicker, 
  Tooltip,
  Card,
  Row,
  Col,
  Pagination
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BankOutlined
} from '@ant-design/icons';
import { lawService, lawTypeService } from '../services/adminService';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const LawsManagement = () => {
  const [laws, setLaws] = useState([]);
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLaw, setEditingLaw] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    lawNumber: '',
    lawTypeName: '',
    status: '',
    issuingBody: ''
  });

  useEffect(() => {
    loadLaws();
    loadLawTypes();
  }, [pagination.current, pagination.pageSize]);

  const loadLaws = async () => {
    setLoading(true);
    try {
      const response = await lawService.getAllLaws(
        pagination.current - 1, 
        pagination.pageSize,
        'effectiveDate',
        'DESC'
      );
      
      if (response.content) {
        setLaws(response.content);
        setPagination(prev => ({
          ...prev,
          total: response.totalElements
        }));
      } else if (Array.isArray(response)) {
        setLaws(response);
      }
    } catch (error) {
      message.error('Không thể tải danh sách văn bản pháp luật: ' + error.message);
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLawTypes = async () => {
    try {
      const response = await lawTypeService.getAllLawTypes();
      const types = Array.isArray(response) ? response : [];
      setLawTypes(types);
    } catch (error) {
      message.error('Không thể tải danh sách loại văn bản: ' + error.message);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const criteria = Object.fromEntries(
        Object.entries(searchParams)
          .filter(([_, value]) => value !== '' && value !== null)
      );
      // Log giá trị và kiểu dữ liệu lawTypeName để debug
      console.log('Search lawTypeName:', criteria.lawTypeName, typeof criteria.lawTypeName);
      const response = await lawService.searchLaws(
        criteria,
        pagination.current - 1,
        pagination.pageSize
      );
      if (response.content) {
        setLaws(response.content);
        setPagination(prev => ({
          ...prev,
          total: response.totalElements
        }));
      } else if (Array.isArray(response)) {
        setLaws(response);
      }
    } catch (error) {
      message.error('Tìm kiếm thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLaw(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingLaw(record);
    form.setFieldsValue({
      ...record,
      effectiveDate: record.effectiveDate ? dayjs(record.effectiveDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
      issueDate: record.issueDate ? dayjs(record.issueDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (lawId) => {
    try {
      await lawService.deleteLaw(lawId);
      message.success('Xóa văn bản thành công');
      loadLaws();
    } catch (error) {
      message.error('Xóa văn bản thất bại: ' + error.message);
    }
  };

  // const handleChangeStatus = async (lawId, newStatus) => {
  //   try {
  //     await lawService.changeLawStatus(lawId, newStatus);
  //     message.success('Thay đổi trạng thái thành công');
  //     loadLaws();
  //   } catch (error) {
  //     message.error('Thay đổi trạng thái thất bại: ' + error.message);
  //   }
  // };

  const handleSubmit = async (values) => {
    try {
      const lawData = {
        ...values,
        effectiveDate: values.effectiveDate?.toISOString(),
        expiryDate: values.expiryDate?.toISOString(),
        issueDate: values.issueDate?.toISOString(),

      };

      if (editingLaw) {
        await lawService.updateLaw(editingLaw.lawId, lawData);
        message.success('Cập nhật văn bản thành công');
      } else {
        await lawService.createLaw(lawData);
        message.success('Tạo văn bản thành công');
      }

      setIsModalVisible(false);
      loadLaws();
    } catch (error) {
      message.error((editingLaw ? 'Cập nhật' : 'Tạo') + ' văn bản thất bại: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID': return 'green';
      case 'DRAFT': return 'orange';
      case 'EXPIRED': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VALID': return 'Có hiệu lực';
      case 'DRAFT': return 'Bản nháp';
      case 'EXPIRED': return 'Hết hiệu lực';
      default: return status;
    }
  };

  // Custom date validation functions
  const validateIssueDate = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const effectiveDate = form.getFieldValue('effectiveDate');
    if (effectiveDate && value.isAfter(effectiveDate)) {
      return Promise.reject(new Error('Ngày ban hành phải nhỏ hơn ngày có hiệu lực'));
    }
    
    return Promise.resolve();
  };

  const validateEffectiveDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn ngày có hiệu lực'));
    }
    
    const issueDate = form.getFieldValue('issueDate');
    const expiryDate = form.getFieldValue('expiryDate');
    
    if (issueDate && value.isBefore(issueDate)) {
      return Promise.reject(new Error('Ngày có hiệu lực phải lớn hơn ngày ban hành'));
    }
    
    if (expiryDate && value.isAfter(expiryDate)) {
      return Promise.reject(new Error('Ngày có hiệu lực phải nhỏ hơn ngày hết hiệu lực'));
    }
    
    return Promise.resolve();
  };

  const validateExpiryDate = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const effectiveDate = form.getFieldValue('effectiveDate');
    if (effectiveDate && value.isBefore(effectiveDate)) {
      return Promise.reject(new Error('Ngày hết hiệu lực phải lớn hơn ngày có hiệu lực'));
    }
    
    return Promise.resolve();
  };

  const columns = [
    {
      title: 'Số văn bản',
      dataIndex: 'lawNumber',
      key: 'lawNumber',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-blue-600 font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Loại văn bản',
      dataIndex: 'lawTypeName',
      key: 'lawTypeName',
      width: 140,
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="blue">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Cơ quan ban hành',
      dataIndex: 'issuingBody',
      key: 'issuingBody',
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div className="flex items-center">
            <BankOutlined className="mr-1 text-gray-500" />
            <span className="truncate">{text}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày có hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
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
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    // {
    //   title: 'Người tạo',
    //   dataIndex: 'createdByUserName',
    //   key: 'createdByUserName',
    //   width: 120,
    //   render: (text) => text || '---',
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 110,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '---',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          {/* <Select
            size="small"
            value={record.status}
            style={{ width: 90 }}
            onChange={(value) => handleChangeStatus(record.lawId, value)}
          >
            <Option value="DRAFT">Nháp</Option>
            <Option value="VALID">Hiệu lực</Option>
            <Option value="EXPIRED">Hết hạn</Option>
          </Select> */}
          <Popconfirm
            title="Bạn có chắc muốn xóa văn bản này?"
            onConfirm={() => handleDelete(record.lawId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card 
        title={
          <div className="flex items-center">
            <FileTextOutlined className="mr-2 text-blue-600" />
            <span>Quản lý Văn bản Pháp luật</span>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo văn bản mới
          </Button>
        }
      >
        {/* Search Section */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Số văn bản"
              value={searchParams.lawNumber}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                lawNumber: e.target.value
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn loại văn bản"
              value={searchParams.lawTypeName || undefined}
              onChange={(value) => setSearchParams(prev => ({
                ...prev,
                lawTypeName: value === undefined ? undefined : value
              }))}
              style={{ width: '100%' }}
              allowClear
            >
              {lawTypes.map(type => (
                <Option key={type.lawTypeId} value={type.name}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn trạng thái"
              value={searchParams.status || undefined}
              onChange={(value) => setSearchParams(prev => ({
                ...prev,
                status: value === undefined ? undefined : value
              }))}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="DRAFT">Bản nháp</Option>
              <Option value="VALID">Có hiệu lực</Option>
              <Option value="EXPIRED">Hết hiệu lực</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Cơ quan ban hành"
              value={searchParams.issuingBody}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                issuingBody: e.target.value
              }))}
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button 
              style={{ marginLeft: 8 }}
              onClick={() => {
                setSearchParams({
                  lawNumber: '',
                  lawTypeName: '',
                  status: '',
                  issuingBody: ''
                });
                loadLaws();
              }}
            >
              Đặt lại
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={laws}
          loading={loading}
          rowKey="lawId"
          pagination={false}
          scroll={{ x: 1200 }}
          size="small"
        />

        {/* Pagination */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} văn bản`
            }
            onChange={(page, size) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: size
              }));
            }}
          />
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingLaw ? 'Chỉnh sửa văn bản' : 'Tạo văn bản mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lawTypeId"
                label={
                  <span>
                    Loại văn bản <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Vui lòng chọn loại văn bản' }]}
              >
                <Select placeholder="Chọn loại văn bản">
                  {lawTypes.map(type => (
                    <Option key={type.lawTypeId} value={type.lawTypeId}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lawNumber"
                label={
                  <span>
                    Số văn bản <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập số văn bản' },
                  { 
                    pattern: /^[a-zA-Z0-9\/\-\s]+$/, 
                    message: 'Số văn bản chỉ được chứa chữ cái, số, dấu gạch ngang và dấu gạch chéo' 
                  }
                ]}
              >
                <Input placeholder="Ví dụ: 01/2024/QH15" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="issuingBody"
                label={
                  <span>
                    Cơ quan ban hành <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập cơ quan ban hành' },
                  { min: 3, message: 'Tên cơ quan ban hành phải có ít nhất 3 ký tự' },
                  { max: 200, message: 'Tên cơ quan ban hành không được vượt quá 200 ký tự' }
                ]}
              >
                <Input placeholder="Ví dụ: Quốc hội" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={
                  <span>
                    Trạng thái <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="DRAFT">Bản nháp</Option>
                  <Option value="VALID">Có hiệu lực</Option>
                  <Option value="EXPIRED">Hết hiệu lực</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="issueDate"
                label={
                  <span>
                    Ngày ban hành <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày ban hành' },
                  { validator: validateIssueDate }
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  onChange={() => {
                    // Trigger validation for related fields
                    form.validateFields(['effectiveDate']);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="effectiveDate"
                label={
                  <span>
                    Ngày có hiệu lực <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                rules={[
                  { validator: validateEffectiveDate }
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  onChange={() => {
                    // Trigger validation for related fields
                    form.validateFields(['issueDate', 'expiryDate']);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expiryDate"
                label={
                  <span>
                    Ngày hết hiệu lực 
                  </span>
                }
                rules={[
                  { validator: validateExpiryDate }
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  onChange={() => {
                    // Trigger validation for related fields
                    form.validateFields(['effectiveDate']);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="contentUrl"
            label="URL nội dung"
            rules={[
              {
                type: 'url',
                message: 'Vui lòng nhập URL hợp lệ (ví dụ: https://example.com)'
              }
            ]}
          >
            <Input placeholder="https://example.com/law-content.pdf" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả nội dung văn bản..." 
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingLaw ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LawsManagement;