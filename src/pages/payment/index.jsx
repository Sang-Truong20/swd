import { useMutation } from '@tanstack/react-query';
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
import VNPAY from '../../assets/images/vnpay_logo.jpg';
import { useClipboard } from '../../hooks/useClipboard';
import { createPackageAfterPayment } from '../../services/package';
import {
  formatAmount,
  formatDate,
  getResponseCodeMessageVnpay,
  notify,
} from '../../utils';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const { copiedField, copyToClipboard } = useClipboard();
  const navigate = useNavigate();
  const usagePackageId = localStorage.getItem('usagePackageId');
  const userId = localStorage.getItem('userId');

  const { mutate: mutateCreatePackage, isPending: isLoadingCreatePackage } =
    useMutation({
      mutationFn: createPackageAfterPayment,
      onSuccess: () => {
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
      transactionMethod: 'VNPAY',
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
    if (data?.vnp_TransactionStatus === '00') {
      mutateCreatePackage(payload);
    }
  }, []);

  const getStatusInfo = (responseCode, transactionStatus) => {
    if (responseCode === '00' && transactionStatus === '00') {
      return {
        status: 'Thành công',
        message: 'THANH TOÁN THÀNH CÔNG',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
      };
    } else if (responseCode === '24' || transactionStatus === '02') {
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

  const statusInfo = getStatusInfo(
    paymentData?.vnp_ResponseCode,
    paymentData?.vnp_TransactionStatus,
  );
  const StatusIcon = statusInfo?.icon;

  const isPaymentSuccessful =
    paymentData?.vnp_ResponseCode === '00' &&
    paymentData?.vnp_TransactionStatus === '00';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-2xl rounded-t-3xl border-b-4 border-blue-600 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <img
                  src={VNPAY}
                  alt="vnpay_logo"
                  className="w-12 h-12 bg-white"
                />
                <div>
                  <h1 className="text-2xl font-bold">VNPAY</h1>
                  <p className="text-blue-100 text-sm">
                    Cổng thanh toán điện tử
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Receipt className="w-12 h-12 text-blue-200 mb-2" />
                <div className="text-xs text-blue-100">HÓA ĐƠN ĐIỆN TỬ</div>
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
                  Mã giao dịch: {paymentData?.vnp_TxnRef}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} bg-gray-100`}
                >
                  {statusInfo.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(paymentData?.vnp_PayDate)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Chi tiết thanh toán
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {paymentData?.vnp_OrderInfo}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatAmount(paymentData?.vnp_Amount)}
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
                        {paymentData?.vnp_TxnRef}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(paymentData?.vnp_TxnRef, 'txnRef')
                        }
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedField === 'txnRef' ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Ngân hàng</span>
                    <span className="font-medium text-sm">
                      {paymentData?.vnp_BankCode}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Loại giao dịch
                    </span>
                    <span className="font-medium text-sm uppercase">
                      {paymentData?.vnp_CardType}
                    </span>
                  </div>

                  {paymentData?.vnp_TransactionNo &&
                    paymentData?.vnp_TransactionNo !== '0' && (
                      <div className="px-4 py-3 flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Số GD VNPay
                        </span>
                        <div className="flex items-center">
                          <span className="font-mono text-sm font-medium mr-2">
                            {paymentData?.vnp_TransactionNo}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                paymentData?.vnp_TransactionNo,
                                'transactionNo',
                              )
                            }
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {copiedField === 'transactionNo' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Thời gian</span>
                    <span className="font-medium text-sm">
                      {formatDate(paymentData?.vnp_PayDate)}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600 text-sm block mb-1">
                      Trạng thái
                    </span>
                    <span className="text-sm text-gray-700 italic">
                      {getResponseCodeMessageVnpay(
                        paymentData?.vnp_ResponseCode,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {isPaymentSuccessful && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">TỔNG CỘNG</h3>
                      <p className="text-xs text-gray-600">
                        Số tiền đã thanh toán
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-blue-600">
                        {formatAmount(paymentData?.vnp_Amount)}
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
                Hóa đơn được tạo tự động bởi hệ thống VNPAY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
