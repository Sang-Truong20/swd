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

const me = (userId) => {
  return axiosClient.get(`/query/users/userId/${userId}`);
};

export { login, refresh, register, me };
