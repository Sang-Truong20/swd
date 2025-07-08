import {
  FaBalanceScale,
  FaGavel,
  FaLightbulb,
  FaQuestionCircle,
} from 'react-icons/fa';

export const quickOptions = [
  {
    icon: FaGavel,
    text: 'Luật giao thông',
    query: 'Tôi cần tư vấn về luật giao thông',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    icon: FaBalanceScale,
    text: 'Luật lao động',
    query: 'Tôi cần tư vấn về luật lao động',
    color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
  },
  {
    icon: FaLightbulb,
    text: 'Luật dân sự',
    query: 'Tôi cần tư vấn về luật dân sự',
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    icon: FaQuestionCircle,
    text: 'Luật hình sự',
    query: 'Tôi cần tư vấn về luật hình sự',
    color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
  },
];
