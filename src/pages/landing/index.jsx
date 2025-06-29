import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Card, Spin } from 'antd';
import { 
  SearchOutlined, 
  MessageOutlined, 
  BookOutlined, 
  FileTextOutlined,
  SafetyOutlined,
  TeamOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Search } = Input;

const LandingPage = () => {
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: <MessageOutlined className="text-4xl text-blue-600" />,
      title: "Hỏi đáp thông minh",
      description: "Trợ lý AI giải đáp các câu hỏi về pháp luật Việt Nam một cách chính xác và nhanh chóng.",
    },
    {
      icon: <BookOutlined className="text-4xl text-green-600" />,
      title: "Tra cứu Pháp điển",
      description: "Tra cứu Pháp điển Việt Nam hiện hành với giao diện thân thiện và dễ sử dụng.",
    },
    {
      icon: <FileTextOutlined className="text-4xl text-orange-600" />,
      title: "Văn bản QPPL",
      description: "Tìm kiếm và tra cứu các văn bản quy phạm pháp luật một cách toàn diện.",
    },
    {
      icon: <SafetyOutlined className="text-4xl text-red-600" />,
      title: "Đáng tin cậy",
      description: "Thông tin được cập nhật liên tục từ các nguồn pháp luật chính thức.",
    },
    {
      icon: <TeamOutlined className="text-4xl text-purple-600" />,
      title: "Hỗ trợ 24/7",
      description: "Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi với các vấn đề pháp lý.",
    },
    {
      icon: <SearchOutlined className="text-4xl text-cyan-600" />,
      title: "Tìm kiếm nâng cao",
      description: "Công cụ tìm kiếm thông minh giúp bạn tìm thông tin chính xác nhất.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <Row gutter={[48, 32]} align="middle" className="min-h-[500px]">
            <Col xs={24} md={12} className="text-center md:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Smart<span className="text-yellow-400">Law</span>
                  <span className="text-blue-200">GT</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium">
                  Hệ thống tư vấn pháp luật thông minh
                </p>
                <div className="space-y-4">
                  <p className="text-lg text-blue-50 leading-relaxed">
                    Giải pháp công nghệ hàng đầu giúp bạn tra cứu, tìm hiểu và giải đáp mọi thắc mắc về pháp luật Việt Nam một cách nhanh chóng và chính xác.
                  </p>
                  <ul className="space-y-2 text-blue-50">
                    <li className="flex items-center space-x-2">
                      <RightOutlined className="text-yellow-400" />
                      <span>Dựa trên công nghệ AI và machine learning tiên tiến</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RightOutlined className="text-yellow-400" />
                      <span>Cơ sở dữ liệu pháp luật được cập nhật liên tục</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RightOutlined className="text-yellow-400" />
                      <span>Giao diện thân thiện, dễ sử dụng</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 font-semibold px-8 py-3 h-auto"
                  >
                    Bắt đầu ngay
                  </Button>
                  <Button 
                    size="large" 
                    className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-3 h-auto"
                  >
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} className="text-center">
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <BookOutlined className="text-8xl text-white" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                  <SafetyOutlined className="text-3xl text-blue-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center">
                  <MessageOutlined className="text-2xl text-white" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tìm kiếm thông tin pháp luật
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nhập từ khóa để tìm kiếm các điều luật, văn bản quy phạm pháp luật phù hợp
          </p>
          <div className="max-w-2xl mx-auto">
            <Search
              placeholder="Nhập từ khóa tìm kiếm..."
              enterButton={<Button type="primary" icon={<SearchOutlined />} loading={loading}>Tìm kiếm</Button>}
              size="large"
              onSearch={handleSearch}
              className="text-lg"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Ví dụ: "luật lao động", "hợp đồng mua bán", "quyền sở hữu trí tuệ"
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SmartLawGT cung cấp các tính năng mạnh mẽ giúp bạn tiếp cận thông tin pháp luật một cách hiệu quả nhất
            </p>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Card 
                  className="h-full hover:shadow-lg transition-all duration-300 border-0 rounded-xl"
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div className="text-center space-y-4">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={12} md={6}>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-blue-200">Văn bản pháp luật</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-200">Hỗ trợ liên tục</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-blue-200">Độ chính xác</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-blue-200">Người dùng tin tưởng</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu với SmartLawGT?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hãy trải nghiệm ngay hôm nay để khám phá sức mạnh của công nghệ trong việc tra cứu pháp luật
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              type="primary" 
              size="large" 
              className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 font-semibold px-8 py-3 h-auto"
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
      </section>
    </div>
  );
};

export default LandingPage;
