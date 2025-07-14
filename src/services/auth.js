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
  return axiosClient.post(`/auth/google`, payload);
};

const receiveOTP = (email) => {
  return axiosClient.post(`/otp/send?email=${email}`);
};

const verifyAccount = ({ email, otp }) => {
  return axiosClient.post(`/otp/verify?email=${email}&otp=${otp}`);
};

const resetPassword = ({ email, newPassword }) => {
  return axiosClient.put(
    `/command/user/reset-password?email=${email}&newPassword=${newPassword}`,
  );
};

export {
  login,
  loginGoogle,
  me,
  receiveOTP,
  refresh,
  register,
  resetPassword,
  verifyAccount,
};
