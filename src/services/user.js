import axiosClient from '../configs/axiosClient';

const createUser = (payload) => {
  return axiosClient.post(`/command/user`, payload);
};

const updateUserInfo = ({ payload, userId }) => {
  return axiosClient.put(`/command/user/${userId}`, payload);
};

const changePassword = ({ userId, oldPassword, newPassword }) => {
  return axiosClient.put(
    `/command/user/${userId}/change-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
  );
};

export { createUser, updateUserInfo, changePassword };
