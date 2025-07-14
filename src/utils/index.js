import { notification } from 'antd';

export const formatDateChatBot = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Hôm nay';
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Hôm qua';
  } else {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

export const notify = (type, { description, duration = 3 } = {}) => {
  const defaultMessages = {
    info: 'Thông báo',
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
  };

  if (!['info', 'success', 'error', 'warning'].includes(type)) {
    console.warn('Loại thông báo không hợp lệ:', type);
    return;
  }

  notification[type]({
    message: defaultMessages[type],
    ...(description && { description }),
    duration,
  });
};

export const formatAmountVnpayRes = (amount) => {
  const amountInVND = parseInt(amount) / 100;
  return `${amountInVND.toLocaleString('vi-VN')} VND`;
};

export const formatDate = (dateString) => {
  if (!dateString || dateString.length < 14) return dateString;

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const hour = dateString.substring(8, 10);
  const minute = dateString.substring(10, 12);
  const second = dateString.substring(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export const getResponseCodeMessageVnpay = (code) => {
  const codes = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
    24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    75: 'Ngân hàng thanh toán đang bảo trì.',
    79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
    99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
  };
  return codes[code] || 'Mã lỗi không xác định';
};

export const getDateKey = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString();
};

export const formatDatePackageManager = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDaysRemaining = (expirationDate) => {
  const now = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatCurrency = (amount) => {
  const amountInVND = parseInt(amount);
  return `${amountInVND.toLocaleString('vi-VN')} VND`;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
