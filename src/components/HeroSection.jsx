import React from 'react';
import { Row, Col, Button } from 'antd';
import { 
  BookOutlined, 
  SafetyOutlined, 
  MessageOutlined,
  RightOutlined 
} from '@ant-design/icons';

const HeroSection = ({ onGetStarted, onLearnMore }) => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4">
        <Row gutter={[48, 32]} align="middle" className="min-h-[500px]">
          <Col xs={24} md={12} className="text-center md:text-left">
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Smart<span className="text-yellow-400 drop-shadow-lg">Law</span>
                  <span className="text-blue-200">GT</span>
                </h1>
                <div className="w-24 h-1 bg-yellow-400 mx-auto md:mx-0 rounded-full"></div>
              </div>
              
              <p className="text-xl md:text-2xl text-blue-100 font-medium">
                Hệ thống tư vấn pháp luật thông minh
              </p>
              
              <div className="space-y-4">
                <p className="text-lg text-blue-50 leading-relaxed">
                  Giải pháp công nghệ hàng đầu giúp bạn tra cứu, tìm hiểu và giải đáp mọi thắc mắc về pháp luật Việt Nam một cách nhanh chóng và chính xác.
                </p>
                
                <ul className="space-y-3 text-blue-50">
                  <li className="flex items-center space-x-3 group">
                    <RightOutlined className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    <span>Dựa trên công nghệ AI và machine learning tiên tiến</span>
                  </li>
                  <li className="flex items-center space-x-3 group">
                    <RightOutlined className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    <span>Cơ sở dữ liệu pháp luật được cập nhật liên tục</span>
                  </li>
                  <li className="flex items-center space-x-3 group">
                    <RightOutlined className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    <span>Giao diện thân thiện, dễ sử dụng</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={onGetStarted}
                  className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 font-semibold px-8 py-3 h-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Bắt đầu ngay
                </Button>
                <Button 
                  size="large" 
                  onClick={onLearnMore}
                  className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-3 h-auto transition-all duration-300"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12} className="text-center">
            <div className="relative animate-float">
              {/* Main circle */}
              <div className="w-80 h-80 mx-auto bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
                <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-inner">
                  <BookOutlined className="text-8xl text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <SafetyOutlined className="text-3xl text-blue-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-300">
                <MessageOutlined className="text-2xl text-white" />
              </div>
              
              {/* Subtle background circles */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white border-opacity-20 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-white border-opacity-10 rounded-full animate-spin-reverse"></div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSection;
