import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select, Space, Modal, message, Tag } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import lawsService from '../../../services/laws';
import axiosClient from '../../../configs/axiosClient';

const { Option } = Select;
const { Search } = Input;

const LawsManagement = () => {
  const [laws, setLaws] = useState([]);
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchData();
    // Test direct call to service
    testDirectCall();
  }, []);

  const testDirectCall = async () => {
    try {
      console.log('Testing direct service call...');
      const result = await lawsService.getAllLaws();
      console.log('Direct call result:', result);
      
      // Test direct axios call
      console.log('Testing direct axios call...');
      const axiosResult = await axiosClient.get('/api/v1/query/laws');
      console.log('Direct axios result:', axiosResult);
    } catch (error) {
      console.error('Direct call error:', error);
      message.error(`API Error: ${error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching laws data...');
      
      const [lawsResponse, typesResponse] = await Promise.all([
        lawsService.getAllLaws(),
        lawsService.getLawTypes()
      ]);
      
      console.log('Laws response:', lawsResponse);
      console.log('Types response:', typesResponse);
      
      const lawsData = lawsResponse.data || [];
      const typesData = typesResponse.data || [];
      
      setLaws(lawsData);
      setLawTypes(typesData);
      
      console.log('Data set successfully', { lawsCount: lawsData.length, typesCount: typesData.length });
    } catch (error) {
      console.error('Error fetching laws data:', error);
      message.error('Không thể tải danh sách văn bản pháp luật');
      setLaws([]);
      setLawTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const response = await lawsService.searchLaws({ query: value });
      setLaws(response.data || []);
    } catch (error) {
      console.error('Error searching laws:', error);
      message.error('Không thể tìm kiếm văn bản pháp luật');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByType = async (typeId) => {
    setSelectedType(typeId);
    if (!typeId) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const response = await lawsService.getLawsByType(typeId);
      setLaws(response.data || []);
    } catch (error) {
      console.error('Error filtering laws by type:', error);
      message.error('Không thể lọc văn bản pháp luật theo loại');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByStatus = async (status) => {
    setSelectedStatus(status);
    if (!status) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const response = await lawsService.getLawsByStatus(status);
      setLaws(response.data || []);
    } catch (error) {
      console.error('Error filtering laws by status:', error);
      message.error('Không thể lọc văn bản pháp luật theo trạng thái');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLaw = (record) => {
    // Open law detail in new tab or modal
    window.open(`/laws/${record.lawId}`, '_blank');
  };

  const handleEditLaw = (record) => {
    // TODO: Implement edit functionality
    message.info('Chức năng chỉnh sửa đang được phát triển');
  };

  const handleDeleteLaw = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa văn bản pháp luật',
      content: `Bạn có chắc chắn muốn xóa văn bản "${record.lawNumber}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Implement delete API call
          message.success('Xóa văn bản pháp luật thành công');
          fetchData();
        } catch (error) {
          console.error('Error deleting law:', error);
          message.error('Không thể xóa văn bản pháp luật');
        }
      },
    });
  };

  const handleAddLaw = () => {
    // TODO: Implement add functionality
    message.info('Chức năng thêm mới đang được phát triển');
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      VALID: { color: 'green', text: 'Có hiệu lực' },
      DRAFT: { color: 'orange', text: 'Dự thảo' },
      EXPIRED: { color: 'red', text: 'Hết hiệu lực' }
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  const columns = [
    {
      title: 'Số hiệu',
      dataIndex: 'lawNumber',
      key: 'lawNumber',
      width: 150,
      ellipsis: true,
      render: (text) => text || 'N/A'
    },
    {
      title: 'Loại văn bản',
      dataIndex: ['lawType', 'name'],
      key: 'lawType',
      width: 150,
      ellipsis: true,
      render: (text) => text || 'N/A'
    },
    {
      title: 'Cơ quan ban hành',
      dataIndex: 'issuingBody',
      key: 'issuingBody',
      width: 180,
      ellipsis: true,
      render: (text) => text || 'N/A'
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 120,
      render: formatDate
    },
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      render: formatDate
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewLaw(record)}
            title="Xem chi tiết"
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditLaw(record)}
            title="Chỉnh sửa"
            size="small"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLaw(record)}
            title="Xóa"
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý văn bản pháp luật</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách các văn bản pháp luật trong hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddLaw}
          size="large"
        >
          Thêm văn bản mới
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Search
              placeholder="Tìm kiếm văn bản pháp luật..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
              size="large"
            />
          </div>
          
          <Select
            placeholder="Lọc theo loại văn bản"
            allowClear
            value={selectedType}
            onChange={handleFilterByType}
            style={{ width: '100%' }}
            size="large"
          >
            {lawTypes.map((type) => (
              <Option key={type.lawTypeId} value={type.lawTypeId}>
                {type.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            value={selectedStatus}
            onChange={handleFilterByStatus}
            style={{ width: '100%' }}
            size="large"
          >
            <Option value="VALID">Có hiệu lực</Option>
            <Option value="DRAFT">Dự thảo</Option>
            <Option value="EXPIRED">Hết hiệu lực</Option>
          </Select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Tìm thấy {laws.length} văn bản pháp luật
          </span>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              size="small"
            >
              Làm mới
            </Button>
          </Space>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={laws}
          rowKey="lawId"
          loading={loading}
          pagination={{
            total: laws.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} văn bản`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: 'Không có dữ liệu'
          }}
        />
      </div>
    </div>
  );
};

export default LawsManagement;
