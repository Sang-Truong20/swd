import React from 'react';
import { Card } from 'antd';

const FeatureCard = ({ icon, title, description, className = "" }) => {
  return (
    <Card 
      className={`h-full hover:shadow-xl transition-all duration-300 border-0 rounded-xl bg-white ${className}`}
      bodyStyle={{ padding: '32px 24px' }}
      hoverable
    >
      <div className="text-center space-y-4">
        <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default FeatureCard;
