import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import { Calendar, Clock, CreditCard, Inbox, Package } from 'lucide-react';
import { useState } from 'react';
import { getUserPackageHistory } from '../../services/user-package';
import {
  formatCurrency,
  formatDatePackageManager,
  getDaysRemaining,
} from '../../utils';

const PackageManager = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem('userId');

  const { data: packageHistory } = useQuery({
    queryKey: ['user-package', userId],
    queryFn: () =>
      getUserPackageHistory(userId, {
        page: 0,
        size: 20,
        sort: ['createdAt,desc'],
      }),
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const packageHistoryList = packageHistory?.data?.content || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageGradient = (status, index) => {
    if (status === 'ACTIVE') {
      return index % 2 === 0
        ? 'from-blue-50 to-indigo-50 border-blue-100'
        : 'from-green-50 to-emerald-50 border-green-100';
    }
    return 'from-gray-50 to-gray-100 border-gray-200';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'EXPIRED':
        return 'Đã hết hạn';
      case 'PENDING':
        return 'Chờ xử lý';
      default:
        return 'Không xác định';
    }
  };

  const getIconColor = (status, index) => {
    if (status === 'ACTIVE') {
      return index % 2 === 0 ? 'bg-blue-600' : 'bg-green-600';
    }
    return 'bg-gray-600';
  };

  const handlePackageClick = (packageData) => {
    setSelectedPackage(packageData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý gói dịch vụ
        </h2>
        <p className="text-gray-600 mt-2">Quản lý các gói dịch vụ của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packageHistoryList.map((packageData, index) => {
          const daysRemaining = getDaysRemaining(packageData?.expirationDate);
          const isExpired = daysRemaining <= 0;
          const actualStatus = isExpired ? 'EXPIRED' : packageData?.status;

          return (
            <div
              key={packageData?.usagePackageId}
              className={`bg-gradient-to-br ${getPackageGradient(actualStatus, index)} rounded-xl p-6 border cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => handlePackageClick(packageData)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 ${getIconColor(actualStatus, index)} rounded-lg`}
                >
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {packageData?.packageName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: {packageData?.usagePackageId}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-semibold text-blue-700">
                    {formatCurrency(packageData?.packagePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`px-2 py-1 ${getStatusColor(actualStatus)} rounded-full text-xs font-semibold`}
                  >
                    {getStatusText(actualStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Còn lại:</span>
                  <span
                    className={`font-semibold ${isExpired ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {isExpired ? 'Đã hết hạn' : `${daysRemaining} ngày`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giới hạn/ngày:</span>
                  <span className="font-semibold text-gray-700">
                    {packageData?.dailyLimit} lượt
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {packageHistoryList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <p className="text-center text-sm">
            Bạn chưa có lịch sử sử dụng gói dịch vụ nào.
          </p>
        </div>
      )}

      <Modal
        title="Chi tiết gói dịch vụ"
        open={showModal}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Thông tin cơ bản
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Tên gói:</span>
                <p className="font-semibold">{selectedPackage?.packageName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ID Package:</span>
                <p className="font-semibold">
                  {selectedPackage?.userPackageId}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Giá:</span>
                <p className="font-semibold text-blue-700">
                  {formatCurrency(selectedPackage?.packagePrice)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <p
                  className={`inline-block px-2 py-1 ${getStatusColor(getDaysRemaining(selectedPackage?.expirationDate) <= 0 ? 'EXPIRED' : selectedPackage?.status)} rounded-full text-xs font-semibold`}
                >
                  {getDaysRemaining(selectedPackage?.expirationDate) <= 0
                    ? 'EXPIRED'
                    : selectedPackage?.status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Giới hạn sử dụng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">
                  Giới hạn hàng ngày:
                </span>
                <p className="font-semibold">{selectedPackage?.dailyLimit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tổng số ngày:</span>
                <p className="font-semibold">{selectedPackage?.daysLimit}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Thông tin giao dịch
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">
                  Phương thức thanh toán:
                </span>
                <p className="font-semibold">
                  {selectedPackage?.transactionMethod}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày giao dịch:</span>
                <p className="font-semibold">
                  {formatDatePackageManager(selectedPackage?.transactionDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Thời gian
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Ngày tạo:</span>
                <p className="font-semibold">
                  {formatDatePackageManager(selectedPackage?.createdDate)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Cập nhật cuối:</span>
                <p className="font-semibold">
                  {formatDatePackageManager(selectedPackage?.updatedDate)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày hết hạn:</span>
                <p className="font-semibold">
                  {formatDatePackageManager(selectedPackage?.expirationDate)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Còn lại:</span>
                <p
                  className={`font-semibold ${getDaysRemaining(selectedPackage?.expirationDate) <= 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  {getDaysRemaining(selectedPackage?.expirationDate) <= 0
                    ? 'Đã hết hạn'
                    : `${getDaysRemaining(selectedPackage?.expirationDate)} ngày`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackageManager;
