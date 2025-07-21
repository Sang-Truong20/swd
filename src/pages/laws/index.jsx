import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Pagination, 
  Spin, 
  Typography, 
  Space,
  Empty,
  Divider,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  BankOutlined,
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { publicLawService, publicLawTypeService, lawService, lawTypeService } from '../../services/publicLaw';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const LawsPage = () => {
  const [laws, setLaws] = useState([]);
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    lawNumber: '',
    lawTypeId: '',
    issuingBody: ''
  });
  const navigate = useNavigate();

  // Load law types for filter
  useEffect(() => {
    loadLawTypes();
  }, []);

  // Load laws when pagination or search changes
  useEffect(() => {
    loadLaws();
  }, [pagination.current, pagination.pageSize]);

  const loadLawTypes = async () => {
    try {
      const response = await lawTypeService.getAllLawTypes();
      const types = response.data || response;
      setLawTypes(Array.isArray(types) ? types : []);
    } catch (error) {
      console.error('Error loading law types:', error);
      message.error('Không thể tải danh sách loại văn bản');
    }
  };

  const loadLaws = async () => {
    setLoading(true);
    try {
      const response = await lawService.getValidLaws(
        pagination.current - 1,
        pagination.pageSize,
        'effectiveDate',
        'DESC'
      );
      
      const data = response.data || response;
      if (data.content) {
        // Filter only VALID status laws for public view
        const validLaws = data.content.filter(law => law.status === 'VALID');
        setLaws(validLaws);
        setPagination(prev => ({
          ...prev,
          total: validLaws.length
        }));
      } else if (Array.isArray(data)) {
        const validLaws = data.filter(law => law.status === 'VALID');
        setLaws(validLaws);
      }
    } catch (error) {
      console.error('Error loading laws:', error);
      message.error('Không thể tải danh sách văn bản pháp luật');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const criteria = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value)
      );
      
      const response = await lawService.searchLaws(
        criteria,
        0, // Reset to first page
        pagination.pageSize
      );
      
      const data = response.data || response;
      if (data.content) {
        // Filter only VALID status laws for public view
        const validLaws = data.content.filter(law => law.status === 'VALID');
        setLaws(validLaws);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: validLaws.length
        }));
      } else if (Array.isArray(data)) {
        const validLaws = data.filter(law => law.status === 'VALID');
        setLaws(validLaws);
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Tìm kiếm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchParams({
      lawNumber: '',
      lawTypeId: '',
      issuingBody: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
    loadLaws();
  };

  const handleViewDetail = (law) => {
    navigate(`/laws/${law.lawId}`, { state: { law } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID': return 'success';
      case 'DRAFT': return 'warning';
      case 'EXPIRED': return 'error';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            <FileTextOutlined className="mr-3 text-blue-600" />
            Văn bản Pháp luật Giao thông
          </Title>
          <Text type="secondary" className="text-lg">
            Hệ thống tra cứu văn bản pháp luật giao thông đường bộ
          </Text>
        </div>

        {/* Search Section */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Số văn bản"
                prefix={<SearchOutlined />}
                value={searchParams.lawNumber}
                onChange={(e) => setSearchParams(prev => ({
                  ...prev,
                  lawNumber: e.target.value
                }))}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Loại văn bản"
                style={{ width: '100%' }}
                value={searchParams.lawTypeId}
                onChange={(value) => setSearchParams(prev => ({
                  ...prev,
                  lawTypeId: value
                }))}
                allowClear
              >
                {lawTypes.map(type => (
                  <Option key={type.lawTypeId} value={type.lawTypeId}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Cơ quan ban hành"
                prefix={<BankOutlined />}
                value={searchParams.issuingBody}
                onChange={(e) => setSearchParams(prev => ({
                  ...prev,
                  issuingBody: e.target.value
                }))}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button 
                  icon={<FilterOutlined />}
                  onClick={handleResetSearch}
                >
                  Đặt lại
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Laws Grid */}
        <Spin spinning={loading}>
          {laws.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {laws.map(law => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={law.lawId}>
                    <Card
                      hoverable
                      className="h-full"
                      actions={[
                        <Button 
                          type="link" 
                          icon={<EyeOutlined />}
                          onClick={() => handleViewDetail(law)}
                        >
                          Xem chi tiết
                        </Button>
                      ]}
                    >
                      <div className="mb-3">
                        <Tag color="blue" icon={<FileTextOutlined />}>
                          {law.lawTypeName || 'Văn bản'}
                        </Tag>
                        <Tag color={getStatusColor(law.status)}>
                          {getStatusText(law.status)}
                        </Tag>
                      </div>
                      
                      <Title level={5} className="!mb-2 text-blue-600">
                        {law.lawNumber}
                      </Title>
                      
                      <div className="text-gray-600 mb-2">
                        <BankOutlined className="mr-1" />
                        <Text>{law.issuingBody}</Text>
                      </div>
                      
                      <div className="text-gray-500 mb-3">
                        <CalendarOutlined className="mr-1" />
                        <Text className="text-sm">
                          Hiệu lực: {law.effectiveDate ? dayjs(law.effectiveDate).format('DD/MM/YYYY') : '---'}
                        </Text>
                      </div>
                      
                      {law.description && (
                        <Paragraph 
                          ellipsis={{ rows: 2, tooltip: law.description }}
                          className="text-gray-600 text-sm !mb-0"
                        >
                          {law.description}
                        </Paragraph>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className="mt-8 text-center">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} trong ${total} văn bản`
                  }
                  onChange={(page, size) => {
                    setPagination(prev => ({
                      ...prev,
                      current: page,
                      pageSize: size
                    }));
                  }}
                  pageSizeOptions={['12', '24', '48', '96']}
                />
              </div>
            </>
          ) : (
            !loading && (
              <Empty 
                description="Không tìm thấy văn bản pháp luật nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          )}
        </Spin>
      </div>
    </div>
  );
};

export default LawsPage;