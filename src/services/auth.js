import axiosClient from '../configs/axiosClient';

const login = (payload) => {
  return axiosClient.post(`/login`, payload);
};

const register = (payload) => {
  return axiosClient.post(`/register`, payload);
};

export { login, register };
