import React from 'react';
import { Row, Col, Card, Avatar } from 'antd';
import { StarFilled, UserOutlined } from '@ant-design/icons';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Luật sư Nguyễn Văn A",
      role: "Luật sư",
      company: "Công ty Luật ABC",
      content: "SmartLawGT đã giúp tôi tiết kiệm rất nhiều thời gian trong việc tra cứu văn bản pháp luật. Giao diện thân thiện và kết quả tìm kiếm rất chính xác.",
      rating: 5,
      avatar: null
    },
    {
      id: 2,
      name: "Chị Trần Thị B",
      role: "Chuyên viên pháp chế",
      company: "Doanh nghiệp XYZ",
      content: "Là một chuyên viên pháp chế, tôi cần tra cứu luật pháp hàng ngày. SmartLawGT giúp tôi làm việc hiệu quả hơn rất nhiều.",
      rating: 5,
      avatar: null
    },
    {
      id: 3,
      name: "Anh Lê Văn C",
      role: "Sinh viên luật",
      company: "Đại học Luật TP.HCM",
      content: "Ứng dụng rất hữu ích cho việc học tập và nghiên cứu. Tôi có thể dễ dàng tìm thấy thông tin cần thiết cho bài tập và luận văn.",
      rating: 4,
      avatar: null
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Người dùng nói gì về SmartLawGT
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hàng ngàn người dùng đã tin tưởng và sử dụng SmartLawGT cho nhu cầu tra cứu pháp luật hàng ngày
          </p>
        </div>
        
        <Row gutter={[32, 32]}>
          {testimonials.map((testimonial) => (
            <Col xs={24} md={8} key={testimonial.id}>
              <Card 
                className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl"
                bodyStyle={{ padding: '32px 24px' }}
              >
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <StarFilled 
                        key={index}
                        className={`text-lg ${
                          index < testimonial.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-600 text-center italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* User Info */}
                  <div className="flex flex-col items-center space-y-2 pt-4 border-t border-gray-100">
                    <Avatar 
                      size={48} 
                      icon={<UserOutlined />}
                      className="bg-blue-500"
                    />
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-400">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TestimonialsSection;
