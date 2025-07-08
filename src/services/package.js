import axiosClient from '../configs/axiosClient';

const payment = (payload) => {
  return axiosClient.post(`/vnpay/payment`, payload);
};

const getAllPackage = () => {
  return axiosClient.get('/query/package/all');
};

export { getAllPackage, payment };
