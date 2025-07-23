import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Spin, 
  Divider,
  Space,
  message,
  Breadcrumb
} from 'antd';
import { 
  ArrowLeftOutlined,
  FileTextOutlined, 
  CalendarOutlined, 
  BankOutlined,
  LinkOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { publicLawService, lawService } from '../../../services/publicLaw';

const { Title, Text, Paragraph } = Typography;

const LawDetailPage = () => {
  const [law, setLaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lawId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.law) {
      setLaw(location.state.law);
      setLoading(false);
    } else {
      loadLawDetail();
    }
  }, [lawId]);

  const loadLawDetail = async () => {
    setLoading(true);
    try {
      const response = await lawService.getLawById(lawId);
      const lawData = response.data || response;
      setLaw(lawData);
    } catch (error) {
      console.error('Error loading law detail:', error);
      message.error('Không thể tải chi tiết văn bản pháp luật');
    } finally {
      setLoading(false);
    }
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

  const handleOpenContent = () => {
    if (law?.contentUrl) {
      window.open(law.contentUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!law) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Text>Không tìm thấy văn bản pháp luật</Text>
          <br />
          <Button type="primary" onClick={() => navigate('/laws')}>
            Quay lại danh sách
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <HomeOutlined />
            <a onClick={() => navigate('/')}>Trang chủ</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => navigate('/laws')}>Văn bản pháp luật</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{law.lawNumber}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/laws')}
          className="mb-6"
        >
          Quay lại danh sách
        </Button>

        {/* Law Detail Card */}
        <Card className="shadow-md">
          {/* Header */}
          <div className="mb-6">
            <Space size={8} wrap>
              <Tag color="blue" icon={<FileTextOutlined />} className="text-sm">
                {law.lawTypeName || 'Văn bản'}
              </Tag>
              <Tag color={getStatusColor(law.status)} className="text-sm">
                {getStatusText(law.status)}
              </Tag>
            </Space>
            
            <Title level={2} className="!mt-4 !mb-0 text-blue-600">
              {law.lawNumber}
            </Title>
          </div>

          {/* Basic Info */}
          <Row gutter={[24, 16]} className="mb-6">
            <Col xs={24} sm={12}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text strong className="text-gray-600">Cơ quan ban hành</Text>
                <div className="mt-1">
                  <BankOutlined className="mr-2 text-blue-500" />
                  <Text className="text-lg">{law.issuingBody}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text strong className="text-gray-600">Ngày có hiệu lực</Text>
                <div className="mt-1">
                  <CalendarOutlined className="mr-2 text-green-500" />
                  <Text className="text-lg">
                    {law.effectiveDate ? dayjs(law.effectiveDate).format('DD/MM/YYYY') : '---'}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          {/* Date Information */}
          <Row gutter={[24, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <div className="text-center p-3 border rounded-lg">
                <Text strong className="text-gray-600">Ngày ban hành</Text>
                <div className="mt-2">
                  <Text className="text-base">
                    {law.issueDate ? dayjs(law.issueDate).format('DD/MM/YYYY') : '---'}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-3 border rounded-lg">
                <Text strong className="text-gray-600">Ngày có hiệu lực</Text>
                <div className="mt-2">
                  <Text className="text-base">
                    {law.effectiveDate ? dayjs(law.effectiveDate).format('DD/MM/YYYY') : '---'}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-3 border rounded-lg">
                <Text strong className="text-gray-600">Ngày hết hiệu lực</Text>
                <div className="mt-2">
                  <Text className="text-base">
                    {law.expiryDate ? dayjs(law.expiryDate).format('DD/MM/YYYY') : 'Không giới hạn'}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />



          {/* Description */}
          {law.description && (
            <>
              <Title level={4}>Mô tả nội dung</Title>
              <Paragraph className="text-gray-700 text-base leading-relaxed mb-6">
                {law.description}
              </Paragraph>
              <Divider />
            </>
          )}

          {/* Content URL */}
          {law.contentUrl && (
            <div className="text-center">
              <Title level={4}>Nội dung văn bản</Title>
              <Button 
                type="primary" 
                size="large"
                icon={<LinkOutlined />}
                onClick={handleOpenContent}
              >
                Xem toàn văn
              </Button>
              <div className="mt-2">
                <Text type="secondary" className="text-sm">
                  Click để xem nội dung chi tiết văn bản
                </Text>
              </div>
            </div>
          )}

          {/* Metadata */}
          <Divider />
          <Row gutter={[24, 8]} className="text-sm text-gray-500">
            {/* <Col xs={24} sm={12}>
              <Text>Người tạo: {law.createdByUserName || '---'}</Text>
            </Col> */}
            <Col xs={24} sm={12}>
              <Text>Ngày tạo: {law.createdDate ? dayjs(law.createdDate).format('DD/MM/YYYY HH:mm') : '---'}</Text>
            </Col>
            {law.updatedDate && (
              <Col xs={24} sm={12}>
                <Text>Cập nhật: {dayjs(law.updatedDate).format('DD/MM/YYYY HH:mm')}</Text>
              </Col>
            )}
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default LawDetailPage;