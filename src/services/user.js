import axiosClient from '../configs/axiosClient';

const createUser = (payload) => {
  return axiosClient.post(`/command/user`, payload);
};

const updateUserInfo = ({ payload, userId }) => {
  return axiosClient.post(`/command/user/${userId}`, payload);
};

export { createUser, updateUserInfo };
