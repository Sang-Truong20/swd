import axiosClient from '../configs/axiosClient';

const getNoticeByUser = (userId) => {
  return axiosClient.get(`/query/notification/user/${userId}`);
};

const getUnreadNoticeByUser = (userId) => {
  return axiosClient.get(`/query/notification/user/${userId}/unread`);
};

const getNoticeCount = (userId) => {
  return axiosClient.get(`/query/notification/user/${userId}/unread/count`);
};

const readAllNotice = (userId) => {
  return axiosClient.put(`/command/notification/user/${userId}/read-all`);
};

const deleteNotice = (noticeId) => {
  return axiosClient.delete(`/command/notification/${noticeId}`);
};

const markReadNotice = (noticeId) => {
  return axiosClient.put(`/command/notification/${noticeId}/read`);
};

export {
  deleteNotice,
  getNoticeByUser,
  getNoticeCount,
  getUnreadNoticeByUser,
  markReadNotice,
  readAllNotice,
};
