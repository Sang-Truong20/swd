import { ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';

const packagesData = [
  {
    id: 1,
    name: 'Free',
    price: '0đ',
    period: '/ Tháng',
    description: 'Trải nghiệm cơ bản các tính năng của ứng dụng',
    features: [
      'Sử dụng các tính năng cơ bản',
      'Hỗ trợ khách hàng 24/7',
      'Truy cập không giới hạn nội dung miễn phí',
    ],
    buttonText: '🚀 Trải nghiệm ngay',
    isPopular: false,
  },
  {
    id: 2,
    name: 'Premium',
    price: '199.000đ',
    period: '/ Tháng',
    description: 'Mở khóa các tính năng nâng cao để có trải nghiệm tuyệt vời',
    features: [
      'Truy cập toàn bộ tính năng ứng dụng',
      'Hỗ trợ khách hàng VIP',
      'Không quảng cáo',
      'Báo cáo chi tiết và phân tích',
      'Tích hợp API không giới hạn',
    ],
    buttonText: '🚀 Nâng cấp ngay',
    isPopular: true,
  },
];

const Packages = () => {
  const handleUpGradePackage = () => {
    alert('Chức năng nâng cấp gói dịch vụ sẽ sớm được cập nhật!');
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gray-50">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold  bg-clip-text mb-4">
            Gói Dịch Vụ
          </h1>

          <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chọn gói phù hợp với nhu cầu của bạn và bắt đầu hành trình khám phá
            những tính năng tuyệt vời
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {packagesData.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative group flex flex-col rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                pkg.isPopular
                  ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl shadow-blue-500/30 border-2 border-blue-400'
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl shadow-gray-200/50 border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/30'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ PHỔ BIẾN NHẤT
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-2 ${pkg.isPopular ? 'text-blue-100' : 'text-gray-500'}`}
                >
                  {pkg.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black tracking-tight">
                    {pkg.price}
                  </span>
                  <span
                    className={`text-sm ${pkg.isPopular ? 'text-blue-200' : 'text-gray-500'}`}
                  >
                    {pkg.period}
                  </span>
                </div>

                <p
                  className={`text-base leading-relaxed ${pkg.isPopular ? 'text-blue-100' : 'text-gray-600'}`}
                >
                  {pkg.description}
                </p>
              </div>

              <div className="flex-1 mb-8">
                {pkg.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 mb-4 last:mb-0"
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        pkg.isPopular ? 'bg-white/20' : 'bg-blue-100'
                      }`}
                    >
                      <CheckOutlined
                        className={`text-sm ${pkg.isPopular ? 'text-white' : 'text-blue-600'}`}
                      />
                    </div>
                    <p className="font-medium leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpGradePackage}
                className={`relative cursor-pointer w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform active:scale-95 overflow-hidden group ${
                  pkg.isPopular
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                    : 'bg-blue-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {pkg.buttonText}
                  <ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
