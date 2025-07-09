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

const loginGoogle = (payload) => {
  return axiosClient.post(`/query/auth/login`, payload);
};

const receiveOTP = (email) => {
  return axiosClient.post(`/otp/send?email=${email}`);
};

const verifyAccount = ({ email, otp }) => {
  return axiosClient.post(`/otp/verify?email=${email}&otp=${otp}`);
};

export { login, loginGoogle, me, receiveOTP, refresh, register, verifyAccount };
