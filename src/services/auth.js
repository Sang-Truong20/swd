import axiosClient from '../configs/axiosClient';

const login = (payload) => {
  return axiosClient.post(`/query/auth/login`, payload);
};

const register = (payload) => {
  return axiosClient.post(`/command/user`, payload);
};

const refresh = (payload) => {
  return axiosClient.post(`/query/auth/refresh`, payload);
};

export { login, refresh, register };
