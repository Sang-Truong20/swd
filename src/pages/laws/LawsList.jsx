import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Input, Pagination, Row, Select, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lawService, lawTypeService } from '../admin/services/adminService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const LawsPage = () => {
  const [laws, setLaws] = useState([]);
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedLawType, setSelectedLawType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Load law types for filter
  useEffect(() => {
    const loadLawTypes = async () => {
      try {
        const response = await lawTypeService.getActive();
        console.log('Law types response:', response);
        setLawTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error loading law types:', error);
        setLawTypes([]);
      }
    };
    loadLawTypes();
  }, []);

  // Load laws with filters
  useEffect(() => {
    const loadLaws = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
          search: searchText,
          lawTypeId: selectedLawType ? parseInt(selectedLawType) : undefined,
          status: selectedStatus
        };

        console.log('Loading laws with params:', params);
        const response = await lawService.getAll(params);
        console.log('Laws response:', response);
        setLaws(Array.isArray(response.data) ? response.data : []);
        setTotal(response.totalElements || 0);
      } catch (error) {
        console.error('Error loading laws:', error);
        setLaws([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadLaws();
  }, [currentPage, pageSize, searchText, selectedLawType, selectedStatus]);

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleLawTypeChange = (value) => {
    setSelectedLawType(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleCardClick = (lawId) => {
    navigate(`/laws/${lawId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Có hiệu lực';
      case 'INACTIVE':
        return 'Hết hiệu lực';
      default:
        return status;
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="!text-blue-900 !mb-4">
            Văn bản pháp luật
          </Title>
          <Text className="text-gray-600 text-lg">
            Tra cứu và tìm hiểu các văn bản pháp luật Việt Nam
          </Text>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm văn bản pháp luật..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Chọn loại văn bản"
                value={selectedLawType}
                onChange={handleLawTypeChange}
                allowClear
                className="w-full"
              >
                {lawTypes.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Trạng thái"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full"
              >
                <Option value="">Tất cả</Option>
                <Option value="ACTIVE">Có hiệu lực</Option>
                <Option value="INACTIVE">Hết hiệu lực</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Laws Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {laws.map((law) => (
                <Col xs={24} sm={12} lg={8} key={law.id}>
                  <Card
                    hoverable
                    className="h-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCardClick(law.id)}
                    cover={
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-2">⚖️</div>
                          <div className="text-sm opacity-90">Văn bản pháp luật</div>
                        </div>
                      </div>
                    }
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <Tag color={getStatusColor(law.status || 'ACTIVE')} className="mb-2">
                            {getStatusText(law.status || 'ACTIVE')}
                          </Tag>
                          {law.lawTypeName && (
                            <Tag color="blue" className="mb-2">
                              {law.lawTypeName}
                            </Tag>
                          )}
                        </div>
                        
                        <Title level={5} className="!mb-3 !text-gray-800 line-clamp-2">
                          {law.title || 'Tiêu đề không có'}
                        </Title>
                        
                        <Paragraph className="!text-gray-600 !mb-3 text-sm">
                          {truncateContent(law.content || '')}
                        </Paragraph>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            Hiệu lực: {law.effectiveDate ? dayjs(law.effectiveDate).format('DD/MM/YYYY') : 'N/A'}
                          </span>
                          <span>
                            {law.createdAt ? dayjs(law.createdAt).format('DD/MM/YYYY') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {laws.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <Title level={4} className="!text-gray-500 !mb-2">
                  Không tìm thấy văn bản pháp luật
                </Title>
                <Text className="text-gray-400">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Text>
              </div>
            )}

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} văn bản`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LawsPage;
