import { ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import momoLogo from '../assets/images/momo_logo.webp';
import vnpayLogo from '../assets/images/vnpay_logo.jpg';
import PackageSkeleton from '../components/PackageSkeleton';
import { PATH_NAME } from '../constants';
import { useUserData } from '../hooks/useUserData';
import { getAllPackage, payment } from '../services/package';
import { notify } from '../utils';

const Packages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useUserData();

  const { data: packageList, isLoading } = useQuery({
    queryKey: ['user-package-list'],
    queryFn: getAllPackage,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const packageListData = (packageList?.data || []).slice().reverse();

  const packagesData = (packageListData || [])
    .map((item, index) => {
      if (!item) return null;

      const dailyLimit = Number(item.dailyLimit) || 0;
      const daysLimit = Number(item.daysLimit) || 0;
      const price = Number(item.price) || 0;

      const packageConfig = {
        0: {
          period: '/ Tháng',
          description: 'Trải nghiệm cơ bản các tính năng của ứng dụng',
          features: [
            'Sử dụng các tính năng cơ bản',
            'Hỗ trợ khách hàng 24/7',
            'Truy cập không giới hạn nội dung miễn phí',
            `Giới hạn ${dailyLimit} lượt mỗi ngày`,
            `Sử dụng trong ${daysLimit} ngày`,
          ],
          buttonText: '🚀 Trải nghiệm ngay',
          isPopular: false,
        },
        1: {
          period: '/ Tháng',
          description:
            'Mở khóa các tính năng nâng cao để có trải nghiệm tuyệt vời',
          features: [
            'Truy cập toàn bộ tính năng ứng dụng',
            'Hỗ trợ khách hàng VIP',
            'Không quảng cáo',
            'Báo cáo chi tiết và phân tích',
            `Giới hạn ${dailyLimit} lượt mỗi ngày`,
            `Sử dụng trong ${daysLimit} ngày`,
          ],
          buttonText: '🚀 Trải nghiệm ngay',
          isPopular: true,
        },
        2: {
          period: '/ Tháng',
          description: 'Gói cao cấp với nhiều tính năng độc quyền',
          features: [
            'Truy cập toàn bộ tính năng cao cấp',
            'Hỗ trợ khách hàng Premium 24/7',
            'Không quảng cáo',
            'Báo cáo chi tiết và phân tích nâng cao',
            'Tích hợp API không giới hạn',
            `Giới hạn ${dailyLimit} lượt mỗi ngày`,
            `Sử dụng trong ${daysLimit} ngày`,
          ],
          buttonText: '🚀 Trải nghiệm ngay',
          isPopular: false,
        },
      };

      const config = packageConfig[index] || packageConfig[0];

      return {
        usagePackageId: item.usagePackageId,
        name: item.name || 'Gói chưa đặt tên',
        price: price === 0 ? '0đ' : `${price.toLocaleString('vi-VN')}đ`,
        period: config.period,
        description: config.description,
        features: config.features,
        buttonText: config.buttonText,
        isPopular: config.isPopular,
        totalToken: dailyLimit * daysLimit,
      };
    })
    .filter(Boolean)
    .slice(0, 3);

  const { mutate: mutatePayment, isPending } = useMutation({
    mutationFn: payment,
    onSuccess: (res) => {
      const rawString = res?.data;
      const url = rawString.replace(/^redirect:/, '');
      window.location.href = url;
    },
    onError: (err) => {
      console.log('Payment error:', err);
      localStorage.removeItem('usagePackageId');
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  const handleUpGradePackage = (pkg) => {
    if (isProcessing) return;
    if (!userInfo) {
      navigate(PATH_NAME.AUTH);
      notify('info', {
        description: 'Vui lòng đăng nhập trước khi mua gói dịch vụ',
      });
      return;
    }
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
    setSelectedMethod('VNPAY');
  };

  const handlePaymentMethod = (method) => {
    if (!selectedPackage) return;
    const pkg = selectedPackage;
    const payload = {
      amount: Number(pkg.price.replace(/[^\d]/g, '')),
      orderInfo: `Thanh toán ${pkg.name} - ${pkg.totalToken} lượt`,
      transactionMethod: method,
      usagePackageId: pkg.usagePackageId,
    };
    localStorage.setItem('usagePackageId', payload.usagePackageId);
    setIsProcessing(true);
    setShowPaymentModal(false);
    mutatePayment(payload);
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gray-50">
      <Modal
        open={showPaymentModal}
        onCancel={() => setShowPaymentModal(false)}
        footer={null}
        centered
        width={460}
        closable={false}
        className="custom-payment-modal rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Chọn phương thức thanh toán
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm leading-relaxed">
          Vui lòng chọn một phương thức thanh toán để tiếp tục
        </p>

        <div className="flex flex-col gap-5 w-full">
          <div
            className={`flex items-center w-full min-h-[72px] px-4 py-4 rounded-2xl border-2 bg-white shadow-sm cursor-pointer ${selectedMethod === 'VNPAY' ? 'border-blue-600' : 'border-gray-200'}`}
            onClick={() => setSelectedMethod('VNPAY')}
            style={{ userSelect: 'none' }}
          >
            <img
              src={vnpayLogo}
              alt="VNPAY"
              className="w-14 h-14 rounded-full bg-white border-gray-300 border shadow-sm object-contain"
            />
            <div className="flex flex-col flex-1 ml-4">
              <span className="font-semibold text-base text-blue-700">
                VNPAY
              </span>
              <span className="text-xs text-gray-400">
                Thanh toán qua ví điện tử VNPAY
              </span>
            </div>
            {selectedMethod === 'VNPAY' && (
              <span className="ml-2 text-blue-600 font-bold text-lg">✓</span>
            )}
          </div>
          <div
            className={`flex items-center w-full min-h-[72px] px-4 py-4 rounded-2xl border-2 bg-white shadow-sm cursor-pointer ${selectedMethod === 'MOMO' ? 'border-pink-500' : 'border-gray-200'}`}
            onClick={() => setSelectedMethod('MOMO')}
            style={{ userSelect: 'none' }}
          >
            <img
              src={momoLogo}
              alt="MOMO"
              className="w-14 h-14 rounded-full bg-white border border-gray-300 shadow-sm object-contain"
            />
            <div className="flex flex-col flex-1 ml-4">
              <span className="font-semibold text-base text-pink-600">
                MOMO
              </span>
              <span className="text-xs text-gray-400">
                Thanh toán qua ví điện tử MOMO
              </span>
            </div>
            {selectedMethod === 'MOMO' && (
              <span className="ml-2 text-pink-500 font-bold text-lg">✓</span>
            )}
          </div>
        </div>
        <div className="flex gap-x-2 mt-8">
          <button
            className={`cursor-pointer w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-500 shadow-md ${
              selectedMethod
                ? selectedMethod === 'VNPAY'
                  ? 'bg-blue-600 text-white hover:bg-blue-400'
                  : 'bg-pink-500 text-white hover:bg-pink-400'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => handlePaymentMethod(selectedMethod)}
            disabled={!selectedMethod || isProcessing}
            type="button"
          >
            Thanh toán
          </button>
          <button
            className="cursor-pointer w-full py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-500 font-semibold text-base bg-white text-gray-700 border border-gray-300"
            onClick={() => setShowPaymentModal(false)}
            disabled={isProcessing}
          >
            Hủy
          </button>
        </div>
      </Modal>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text mb-4">
            Gói Dịch Vụ
          </h1>

          <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chọn gói phù hợp với nhu cầu của bạn và bắt đầu hành trình khám phá
            những tính năng tuyệt vời
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {isLoading || packagesData.length === 0
            ? [...Array(3)].map((_, index) => <PackageSkeleton key={index} />)
            : packagesData.map((pkg) => (
                <div
                  key={pkg?.usagePackageId}
                  className={`relative group flex flex-col rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 will-change-transform ${
                    pkg.isPopular
                      ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl shadow-blue-500/30 border-2 border-blue-400'
                      : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl shadow-gray-200/50 border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/30'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute w-[190px] -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ PHỔ BIẾN NHẤT
                    </div>
                  )}

                  <div className="mb-8">
                    <h3
                      className={`text-lg font-semibold mb-2 ${pkg.isPopular ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {pkg?.name}
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
                    onClick={() => handleUpGradePackage(pkg)}
                    disabled={isProcessing}
                    className={`relative cursor-pointer w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform active:scale-95 overflow-hidden group ${
                      pkg.isPopular
                        ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
