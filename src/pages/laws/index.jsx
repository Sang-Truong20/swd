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
import { useLocation } from 'react-router-dom';
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
    pageSize: 8,
    total: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Load law types for filter
  useEffect(() => {
    loadLawTypes();
    // Kiểm tra param search trên URL
    const params = new URLSearchParams(location.search);
    const keyword = params.get('search');
    if (keyword) {
      setSearchKeyword(keyword);
      setTimeout(() => {
        handleSearch(keyword);
      }, 0);
    }
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
        // Chỉ lọc VALID cho hiển thị, nhưng dùng totalElements từ backend cho phân trang
        const validLaws = data.content.filter(law => law.status === 'VALID');
        setLaws(validLaws);
        setPagination(prev => ({
          ...prev,
          total: data.totalElements || validLaws.length
        }));
      } else if (Array.isArray(data)) {
        const validLaws = data.filter(law => law.status === 'VALID');
        setLaws(validLaws);
        setPagination(prev => ({
          ...prev,
          total: validLaws.length
        }));
      }
    } catch (error) {
      console.error('Error loading laws:', error);
      message.error('Không thể tải danh sách văn bản pháp luật');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    setLoading(true);
    try {
      const response = await lawService.searchLaws(
        { keyword },
        0,
        pagination.pageSize
      );
      const data = response.data || response;
      if (data.content) {
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
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, current: 1 }));
    loadLaws();
  };

  const handleViewDetail = (law) => {
    navigate(`/laws/${law.lawId}`, { state: { law } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID': return '#52c41a'; // xanh lá
      case 'DRAFT': return '#faad14'; // vàng
      case 'EXPIRED': return '#f5222d'; // đỏ
      default: return '#d9d9d9'; // xám
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
          <Row justify="center">
            <Col xs={24}>
              <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', gap: 8 }}>
                <Input.Search
                  placeholder="Nhập từ khóa tìm kiếm văn bản pháp luật..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  onSearch={value => handleSearch(value)}
                  enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                  size="large"
                  allowClear
                  style={{ flex: 1 }}
                />
                <Button 
                  icon={<FilterOutlined />}
                  onClick={handleResetSearch}
                  size="large"
                  style={{ height: 40, padding: '0 16px' }}
                >
                  Đặt lại
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Laws Grid */}
        <Spin spinning={loading}>
          {laws.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {laws
                  .slice(
                    (pagination.current - 1) * pagination.pageSize,
                    pagination.current * pagination.pageSize
                  )
                  .map(law => (
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
                          <Tag style={{ background: getStatusColor(law.status), color: '#fff', border: 'none', fontWeight: 500 }}>
                            {getStatusText(law.status)}
                          </Tag>
                        </div>
                        <Title level={5} className="!mb-2" style={{ color: '#1890ff', background: '#e6f7ff', padding: '2px 8px', borderRadius: 6, display: 'inline-block' }}>
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
              <div className="mt-8 flex justify-end">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => {
                    if (total === 0) return '';
                    return `${range[0]}-${range[1]} của ${total} văn bản`;
                  }}
                  onChange={(page, size) => {
                    setPagination(prev => ({
                      ...prev,
                      current: page,
                      pageSize: size
                    }));
                  }}
                  pageSizeOptions={['8', '16', '32', '64']}
                  // Cho phép chuyển trang kể cả khi total = 0
                  disabled={false}
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