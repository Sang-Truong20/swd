import axiosClient from '../configs/axiosClient';

const createUser = (payload) => {
  return axiosClient.post(`/command/user`, payload);
};

export { createUser };
