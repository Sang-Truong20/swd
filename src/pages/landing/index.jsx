import {
  BookOutlined,
  FileTextOutlined,
  MessageOutlined,
  SafetyOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { useState } from 'react';
import FeatureCard from '../../components/FeatureCard';
import HeroSection from '../../components/HeroSection';
import Packages from '../../components/Packages';
import TestimonialsSection from '../../components/TestimonialsSection';
import { useUserData } from '../../hooks/useUserData';
import './styles.css';

const { Search } = Input;

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useUserData();

  console.log('check userInfo', userInfo);

  const features = [
    {
      icon: <MessageOutlined className="text-4xl text-blue-600" />,
      title: 'Hỏi đáp thông minh',
      description:
        'Trợ lý AI giải đáp các câu hỏi về pháp luật Việt Nam một cách chính xác và nhanh chóng.',
    },
    {
      icon: <BookOutlined className="text-4xl text-green-600" />,
      title: 'Tra cứu Pháp điển',
      description:
        'Tra cứu Pháp điển Việt Nam hiện hành với giao diện thân thiện và dễ sử dụng.',
    },
    {
      icon: <FileTextOutlined className="text-4xl text-orange-600" />,
      title: 'Văn bản QPPL',
      description:
        'Tìm kiếm và tra cứu các văn bản quy phạm pháp luật một cách toàn diện.',
    },
    {
      icon: <SafetyOutlined className="text-4xl text-red-600" />,
      title: 'Đáng tin cậy',
      description:
        'Thông tin được cập nhật liên tục từ các nguồn pháp luật chính thức.',
    },
    {
      icon: <TeamOutlined className="text-4xl text-purple-600" />,
      title: 'Hỗ trợ 24/7',
      description:
        'Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi với các vấn đề pháp lý.',
    },
    {
      icon: <SearchOutlined className="text-4xl text-cyan-600" />,
      title: 'Tìm kiếm nâng cao',
      description:
        'Công cụ tìm kiếm thông minh giúp bạn tìm thông tin chính xác nhất.',
    },
  ];

  const handleSearch = (value) => {
    setLoading(true);
    // Simulate search functionality
    setTimeout(() => {
      setLoading(false);
      console.log('Searching for:', value);
    }, 1000);
  };

  const handleGetStarted = () => {
    // Navigate to main app or registration
    console.log('Get started clicked');
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <HeroSection
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
      />

      {/* Search Section */}
      <section className="py-16 bg-white search-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tìm kiếm thông tin pháp luật
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nhập từ khóa để tìm kiếm các điều luật, văn bản quy phạm pháp luật
              phù hợp
            </p>
            <div className="max-w-2xl mx-auto">
              <Search
                placeholder="Nhập từ khóa tìm kiếm..."
                enterButton={
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    loading={loading}
                    className="btn-primary"
                  >
                    Tìm kiếm
                  </Button>
                }
                size="large"
                onSearch={handleSearch}
                className="text-lg search-input"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Ví dụ: "luật lao động", "hợp đồng mua bán", "quyền sở hữu trí tuệ"
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SmartLawGT cung cấp các tính năng mạnh mẽ giúp bạn tiếp cận thông
              tin pháp luật một cách hiệu quả nhất
            </p>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <FeatureCard
                    icon={<div className="feature-icon">{feature.icon}</div>}
                    title={feature.title}
                    description={feature.description}
                    className="feature-card hover-lift"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <Packages />

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={12} md={6}>
              <div className="text-white hover-lift">
                <div className="text-4xl font-bold mb-2 stat-number">1000+</div>
                <div className="text-blue-200">Văn bản pháp luật</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white hover-lift">
                <div className="text-4xl font-bold mb-2 stat-number">24/7</div>
                <div className="text-blue-200">Hỗ trợ liên tục</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white hover-lift">
                <div className="text-4xl font-bold mb-2 stat-number">99%</div>
                <div className="text-blue-200">Độ chính xác</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white hover-lift">
                <div className="text-4xl font-bold mb-2 stat-number">5000+</div>
                <div className="text-blue-200">Người dùng tin tưởng</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu với SmartLawGT?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Hãy trải nghiệm ngay hôm nay để khám phá sức mạnh của công nghệ
              trong việc tra cứu pháp luật
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                onClick={handleGetStarted}
                className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 font-semibold px-8 py-3 h-auto btn-primary cta-glow"
              >
                Dùng thử miễn phí
              </Button>
              <Button
                size="large"
                className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-3 h-auto"
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
