import { QueryClient, useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
  Check,
  CheckCircle,
  Clock,
  Copy,
  Info,
  Receipt,
  Star,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MOMO from '../../../assets/images/momo_logo.webp';
import { useClipboard } from '../../../hooks/useClipboard';
import { createPackageAfterPayment } from '../../../services/user-package';
import {
  formatAmountMomoRes,
  formatMomoDate,
  getResponseCodeMessageMomo,
  notify,
} from '../../../utils';

const MomoReturn = () => {
  const { copiedField, copyToClipboard } = useClipboard();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const usagePackageId = localStorage.getItem('usagePackageId');
  const userId = localStorage.getItem('userId');

  const queryClient = new QueryClient();
  const { mutate: mutateCreatePackage, isPending: isLoadingCreatePackage } =
    useMutation({
      mutationFn: createPackageAfterPayment,
      onSuccess: () => {
        queryClient.invalidateQueries(['user-package']);
        localStorage.removeItem('usagePackageId');
      },
      onError: () => {
        notify('error', { description: 'Lỗi hệ thống' });
        localStorage.removeItem('usagePackageId');
      },
    });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      userId,
      usagePackageId,
      transactionMethod: 'MOMO',
    };
    let data = {};

    for (const [key, value] of urlParams.entries()) {
      data[key] = decodeURIComponent(value);
    }

    if (Object.keys(data).length === 0) {
      navigate('/*');
      return;
    }

    setPaymentData(data);

    if (data?.resultCode === '0') {
      mutateCreatePackage(payload);
    } else {
      localStorage.removeItem('usagePackageId');
    }
  }, []);

  const getStatusInfo = (resultCode) => {
    if (resultCode === '0' || resultCode === '9000') {
      return {
        status: 'Thành công',
        message: 'THANH TOÁN THÀNH CÔNG',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
      };
    } else if (
      [
        '10',
        '11',
        '12',
        '13',
        '20',
        '21',
        '22',
        '40',
        '41',
        '42',
        '43',
        '45',
        '47',
        '98',
        '99',
        '1001',
        '1002',
        '1003',
        '1004',
        '1005',
        '1006',
        '1007',
        '1017',
        '1026',
        '1080',
        '1081',
        '1088',
        '2019',
        '4001',
        '4002',
        '4100',
      ].includes(resultCode)
    ) {
      return {
        status: 'Thất bại',
        message: 'THANH TOÁN THẤT BẠI',
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-500',
      };
    } else {
      return {
        status: 'Đang chờ',
        message: 'ĐANG XỬ LÝ',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
      };
    }
  };

  if (!paymentData || isLoadingCreatePackage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const statusInfo = getStatusInfo(paymentData?.resultCode);
  const StatusIcon = statusInfo?.icon;
  const isPaymentSuccessful = paymentData?.resultCode === '0';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-2xl rounded-t-3xl border-b-4 border-pink-500 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <img src={MOMO} alt="momo_logo" className="w-12 h-12 " />
                <div>
                  <h1 className="text-2xl font-bold">MOMO</h1>
                  <p className="text-pink-100 text-sm">
                    Cổng thanh toán điện tử
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Receipt className="w-12 h-12 text-pink-200 mb-2" />
                <div className="text-xs text-pink-100">HÓA ĐƠN ĐIỆN TỬ</div>
              </div>
            </div>
          </div>

          <div className={`${statusInfo.bgColor} text-white py-4 px-6`}>
            <div className="flex items-center justify-center">
              <StatusIcon className="w-6 h-6 mr-3" />
              <span className="text-lg font-bold tracking-wide">
                {statusInfo.message}
              </span>
            </div>
          </div>

          <div className="p-6 bg-white">
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-dashed border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  HÓA ĐƠN THANH TOÁN
                </h2>
                <p className="text-sm text-gray-600">
                  Mã giao dịch: {paymentData?.transId}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} bg-gray-100`}
                >
                  {statusInfo.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMomoDate(paymentData?.responseTime)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-pink-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Chi tiết thanh toán
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {paymentData?.orderInfo}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-600">
                      {formatAmountMomoRes(paymentData?.amount)}
                    </div>
                    <div className="text-xs text-gray-500">Đã bao gồm VAT</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Thông tin giao dịch
                  </h4>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Mã tham chiếu</span>
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-medium mr-2">
                        {paymentData?.transId}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(paymentData?.transId, 'transId')
                        }
                        className="text-gray-400 hover:text-pink-600 transition-colors"
                      >
                        {copiedField === 'transId' ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Mã đơn hàng</span>
                    <span className="font-medium text-sm">
                      {paymentData?.orderId}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Mã đối tác</span>
                    <span className="font-medium text-sm uppercase">
                      {paymentData?.partnerCode}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Loại giao dịch
                    </span>
                    <span className="font-medium text-sm">
                      {paymentData?.orderType}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Thời gian</span>
                    <span className="font-medium text-sm">
                      {formatMomoDate(paymentData?.responseTime)}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600 text-sm block mb-1">
                      Trạng thái giao dịch
                    </span>
                    <span className="text-sm text-gray-700 italic text-right">
                      {getResponseCodeMessageMomo(paymentData?.resultCode)}
                    </span>
                  </div>
                </div>
              </div>

              {isPaymentSuccessful && (
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">TỔNG CỘNG</h3>
                      <p className="text-xs text-gray-600">
                        Số tiền đã thanh toán
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-pink-600">
                        {formatAmountMomoRes(paymentData?.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-300">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">
                  Cảm ơn bạn đã sử dụng dịch vụ!
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Hóa đơn được tạo tự động bởi hệ thống MOMO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomoReturn;
