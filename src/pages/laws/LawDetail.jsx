import { ArrowLeftOutlined, CalendarOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lawService } from '../admin/services/adminService';

const { Title, Paragraph, Text } = Typography;

const LawDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [law, setLaw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLawDetail = async () => {
      try {
        setLoading(true);
                const response = await lawService.getById(parseInt(id));
        setLaw(response.data);
      } catch (error) {
        console.error('Error loading law detail:', error);
        setLaw(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLawDetail();
    }
  }, [id]);

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

  const handleBack = () => {
    navigate('/laws');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!law) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <Title level={4} className="!text-gray-500 !mb-4">
            Không tìm thấy văn bản pháp luật
          </Title>
          <Button type="primary" onClick={handleBack}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="flex items-center"
          >
            Quay lại danh sách
          </Button>
        </div>

        {/* Law Detail Card */}
        <Card className="shadow-sm">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <Tag color={getStatusColor(law.status)} className="text-sm">
                {getStatusText(law.status)}
              </Tag>
              {law.lawTypeName && (
                <Tag color="blue" className="text-sm">
                  <TagOutlined className="mr-1" />
                  {law.lawTypeName}
                </Tag>
              )}
            </div>

            <Title level={1} className="!text-blue-900 !mb-4">
              {law.title}
            </Title>

            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" />
                <span>Ngày có hiệu lực: </span>
                <Text strong className="ml-1">
                  {law.effectiveDate ? dayjs(law.effectiveDate).format('DD/MM/YYYY') : 'N/A'}
                </Text>
              </div>
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" />
                <span>Ngày tạo: </span>
                <Text strong className="ml-1">
                  {law.createdAt ? dayjs(law.createdAt).format('DD/MM/YYYY') : 'N/A'}
                </Text>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <Title level={3} className="!text-gray-800 !mb-4">
              Nội dung văn bản
            </Title>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Paragraph className="!text-gray-700 !text-base !leading-relaxed whitespace-pre-wrap">
                {law.content}
              </Paragraph>
            </div>
          </div>

          <Divider />

          {/* Meta Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Title level={5} className="!text-blue-900 !mb-3">
              Thông tin văn bản
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Text strong>ID văn bản: </Text>
                <Text>{law.id}</Text>
              </div>
              <div>
                <Text strong>Loại văn bản: </Text>
                <Text>{law.lawTypeName || 'Chưa phân loại'}</Text>
              </div>
              <div>
                <Text strong>Trạng thái: </Text>
                <Text>{getStatusText(law.status)}</Text>
              </div>
              <div>
                <Text strong>Ngày cập nhật: </Text>
                <Text>{(law.updatedAt || law.createdAt) ? dayjs(law.updatedAt || law.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A'}</Text>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-3">
              <Button type="primary" onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button 
                onClick={() => window.print()}
                className="flex items-center"
              >
                In văn bản
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LawDetailPage;
