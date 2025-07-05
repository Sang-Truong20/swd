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
