import axiosClient from '../configs/axiosClient';

const payment = (payload) => {
  return axiosClient.post(`/vnpay/payment`, payload);
};

const createPackageAfterPayment = (payload) => {
  return axiosClient.post(`/command/package`, payload);
};

export { createPackageAfterPayment, payment };
