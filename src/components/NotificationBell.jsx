import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Divider, Dropdown, message, Modal, Spin } from 'antd';
import { ArrowLeft, BellOff, Info, MoreHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
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

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
  }, [isOpen, selectedNotice, menuOpen]);

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
  });

  const { data: unreadNotifications, isLoading: isUnreadLoading } = useQuery({
    queryKey: ['notices-unread', userId],
    queryFn: () => getUnreadNoticeByUser(userId).then((res) => res.data),
    enabled: !!userId && showUnread,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
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

  const handleBackClick = () => {
    setShowUnread(false);
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
                        label: 'Xem chưa đọc',
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
                      readAllMutation.isLoading,
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
                ? unreadNotifications.length > 0
                : notifications.length > 0) ? (
              (showUnread ? unreadNotifications : notifications).map(
                (notification) => {
                  const createdDate = new Date(notification.created);
                  const timeString = createdDate.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  return (
                    <>
                      <div
                        key={notification.notificationId}
                        className={`p-3 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => {
                          setSelectedNotice(notification);
                          if (!notification.read) {
                            markReadMutation.mutate(
                              notification.notificationId,
                            );
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1 bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center">
                            <Info size={20} className="text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {timeString}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2" />
                          )}
                        </div>
                      </div>
                      <Divider className="!m-0" />
                    </>
                  );
                },
              )
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
