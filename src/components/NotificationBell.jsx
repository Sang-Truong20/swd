import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Divider, Dropdown, message, Modal, Spin } from 'antd';
import {
  ArrowLeft,
  BellOff,
  Check,
  Info,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  deleteNotice,
  getNoticeByUser,
  getNoticeCount,
  getUnreadNoticeByUser,
  markReadNotice,
  readAllNotice,
} from '../services/notice';

const NotificationBell = () => {
  const userId = localStorage.getItem('userId');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showUnread, setShowUnread] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemMenuOpen, setItemMenuOpen] = useState({});
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedNotice) {
        const modalElement = document.querySelector('.ant-modal');
        if (modalElement && modalElement.contains(event.target)) {
          return;
        }
      }

      if (menuOpen) {
        const menuElement = document.querySelector('.ant-dropdown');
        if (menuElement && menuElement.contains(event.target)) {
          return;
        }
      }

      const hasOpenItemMenu = Object.values(itemMenuOpen).some(Boolean);
      if (hasOpenItemMenu) {
        const itemMenuElements = document.querySelectorAll('.ant-dropdown');
        const isClickingInsideItemMenu = Array.from(itemMenuElements).some(
          (element) => element.contains(event.target),
        );
        if (isClickingInsideItemMenu) {
          return;
        }
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setItemMenuOpen({});
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, selectedNotice, menuOpen, itemMenuOpen]);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notices', userId],
    queryFn: () => getNoticeByUser(userId).then((res) => res.data),
    enabled: !!userId && !showUnread,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => data?.filter((n) => n.enable),
  });

  const { data: unreadNotifications, isLoading: isUnreadLoading } = useQuery({
    queryKey: ['notices-unread', userId],
    queryFn: () => getUnreadNoticeByUser(userId).then((res) => res.data),
    enabled: !!userId && showUnread,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => data?.filter((n) => n.enable),
  });

  const { data: unreadCount, isLoading: isCountLoading } = useQuery({
    queryKey: ['noticeCount', userId],
    queryFn: () => getNoticeCount(userId).then((res) => res.data),
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const markReadMutation = useMutation({
    mutationFn: (noticeId) => markReadNotice(noticeId),
    onSuccess: (data, noticeId) => {
      queryClient.setQueryData(['notices', userId], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.notificationId === noticeId ? { ...n, read: true } : n,
        );
      });
      queryClient.setQueryData(['notices-unread', userId], (old) => {
        if (!old) return old;
        return old.filter((n) => n.notificationId !== noticeId);
      });
      queryClient.setQueryData(['noticeCount', userId], (old) => {
        if (!old || !old > 0) return 0;
        return old - 1;
      });
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi đánh dấu thông báo');
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: (noticeId) => deleteNotice(noticeId),
    onSuccess: (data, noticeId) => {
      queryClient.setQueryData(['notices', userId], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.notificationId === noticeId ? { ...n, enable: false } : n,
        );
      });
      queryClient.setQueryData(['notices-unread', userId], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.notificationId === noticeId ? { ...n, enable: false } : n,
        );
      });
      queryClient.setQueryData(['noticeCount', userId], (old) => {
        if (!old || old <= 0) return 0;
        const wasUnread =
          showUnread ||
          (notifications &&
            notifications.find(
              (n) => n.notificationId === noticeId && !n.read && n.enable,
            ));
        return wasUnread ? old - 1 : old;
      });
      message.success('Đã xóa thông báo');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi xóa thông báo');
    },
  });

  const readAllMutation = useMutation({
    mutationFn: () => readAllNotice(userId),
    onSuccess: () => {
      queryClient.setQueryData(['notices', userId], (old) => {
        if (!old) return old;
        return old.map((n) => ({ ...n, read: true }));
      });
      queryClient.setQueryData(['notices-unread', userId], []);
      queryClient.setQueryData(['noticeCount', userId], 0);
      message.success('Đã đánh dấu tất cả thông báo là đã đọc');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi đánh dấu thông báo');
    },
  });

  const handleMenuClick = ({ key }) => {
    setTimeout(() => {
      if (key === 'back') {
        setShowUnread(false);
      } else if (key === 'unread') {
        setShowUnread(true);
      } else if (key === 'markAll') {
        readAllMutation.mutate();
      }
      setMenuOpen(false);
    }, 0);
  };

  const handleItemMenuClick = (notificationId, { key }, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setTimeout(() => {
      if (key === 'markRead') {
        markReadMutation.mutate(notificationId);
      } else if (key === 'delete') {
        deleteNoticeMutation.mutate(notificationId);
      }
      setItemMenuOpen((prev) => ({ ...prev, [notificationId]: false }));
    }, 0);
  };

  const handleBackClick = () => {
    setShowUnread(false);
  };

  const handleItemMoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setItemMenuOpen({});
    setSelectedNotice(null);
  };

  const handleNotificationClick = (notification) => {
    setItemMenuOpen({});
    setSelectedNotice(notification);
    if (!notification.read) {
      markReadMutation.mutate(notification.notificationId);
    }
  };

  const areAllNotificationsRead = () => {
    const currentNotifications = showUnread
      ? unreadNotifications
      : notifications;
    if (!currentNotifications || currentNotifications.length === 0) return true;

    const enabledNotifications = currentNotifications.filter((n) => n.enable);
    if (enabledNotifications.length === 0) return true;

    if (showUnread) return false;

    return enabledNotifications.every((n) => n.read);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isOpen) {
            setShowUnread(false);
          }
          setIsOpen(!isOpen);
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {isCountLoading ? (
          <Spin size="small" className="absolute -top-1 -right-1" />
        ) : unreadCount > 0 ? (
          <div className="absolute -top-1 -right-1">
            <Badge count={unreadCount} />
          </div>
        ) : null}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-90 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          onClick={handleDropdownClick}
        >
          <div className="p-3 border-b border-gray-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 h-8">
              {showUnread && (
                <button
                  onClick={handleBackClick}
                  className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 text-gray-600 mr-1"
                  aria-label="Quay lại"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {showUnread ? 'Chưa đọc' : 'Thông báo'}
              </h3>
            </div>
            <Dropdown
              open={menuOpen}
              onOpenChange={setMenuOpen}
              menu={{
                items: [
                  showUnread
                    ? {
                        key: 'back',
                        label: 'Quay lại',
                      }
                    : {
                        key: 'unread',
                        label: 'Chưa đọc',
                      },
                  {
                    key: 'markAll',
                    label: readAllMutation.isLoading
                      ? 'Đang xử lý...'
                      : 'Đánh dấu đã đọc hết',
                    disabled:
                      (showUnread ? isUnreadLoading : isLoading) ||
                      !(showUnread ? unreadNotifications : notifications) ||
                      (showUnread
                        ? unreadNotifications?.length === 0
                        : notifications?.length === 0) ||
                      readAllMutation.isLoading ||
                      areAllNotificationsRead(),
                  },
                ],
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
              trigger={['click']}
              getPopupContainer={() => document.body}
            >
              <button
                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                aria-label="Menu thông báo"
              >
                <MoreHorizontal size={20} />
              </button>
            </Dropdown>
          </div>

          <div className="max-h-96 p-2 min-h-96 overflow-y-auto">
            {(showUnread ? isUnreadLoading : isLoading) ? (
              <div className="flex justify-center items-center mt-30">
                <Spin />
              </div>
            ) : (showUnread ? unreadNotifications : notifications) &&
              (showUnread
                ? unreadNotifications.filter((n) => n.enable).length > 0
                : notifications.filter((n) => n.enable).length > 0) ? (
              (showUnread ? unreadNotifications : notifications)
                .filter((notification) => notification.enable)
                .map((notification) => {
                  const createdDate = new Date(notification.created);
                  const timeString = createdDate.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <React.Fragment key={notification.notificationId}>
                      <div
                        className={`p-3 mb-1 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors relative group ${
                          !notification.read ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0 mt-1 bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center">
                            {!notification.read && (
                              <div className="absolute -top-0 right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full" />
                            )}
                            <Info size={20} className="text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm overflow-hidden line-clamp-2 text-ellipsis text-gray-600 mt-1">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {timeString}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Dropdown
                              open={itemMenuOpen[notification.notificationId]}
                              onOpenChange={(open) =>
                                setItemMenuOpen((prev) => ({
                                  ...prev,
                                  [notification.notificationId]: open,
                                }))
                              }
                              menu={{
                                items: [
                                  ...(notification.read
                                    ? []
                                    : [
                                        {
                                          key: 'markRead',
                                          label: (
                                            <div className="flex items-center gap-2">
                                              <Check size={16} />
                                              Đánh dấu đã đọc
                                            </div>
                                          ),
                                          disabled: markReadMutation.isLoading,
                                        },
                                      ]),
                                  {
                                    key: 'delete',
                                    label: (
                                      <div className="flex items-center gap-2 text-red-600">
                                        <Trash2 size={16} />
                                        Xóa thông báo
                                      </div>
                                    ),
                                    disabled: deleteNoticeMutation.isLoading,
                                  },
                                ],
                                onClick: (menuInfo) =>
                                  handleItemMenuClick(
                                    notification.notificationId,
                                    menuInfo,
                                    menuInfo.domEvent,
                                  ),
                              }}
                              placement="bottomRight"
                              trigger={['click']}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentElement || document.body
                              }
                            >
                              <button
                                className="opacity-100 p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                                onClick={(e) => {
                                  handleItemMoreClick(e);
                                }}
                                aria-label="Tùy chọn thông báo"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <Divider className="!m-0" />
                    </React.Fragment>
                  );
                })
            ) : (
              <div className="p-8 mt-20 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                <BellOff className="w-8 h-8 text-gray-400" />
                <p>Không có thông báo mới</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedNotice && (
        <Modal
          open={!!selectedNotice}
          title={selectedNotice?.title}
          onCancel={() => setSelectedNotice(null)}
          footer={null}
        >
          <p>{selectedNotice?.content}</p>
          <p className="text-xs text-gray-500 mt-2">
            {selectedNotice?.created
              ? new Date(selectedNotice.created).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : ''}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default NotificationBell;
