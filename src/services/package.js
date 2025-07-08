import axiosClient from '../configs/axiosClient';

const payment = (payload) => {
  return axiosClient.post(`/vnpay/payment`, payload);
};

const createPackageAfterPayment = (payload) => {
  return axiosClient.post(`/command/package`, payload);
};

const getAllPackage = () => {
  axiosClient.get('/query/package/all');
};

export { createPackageAfterPayment, getAllPackage, payment };
