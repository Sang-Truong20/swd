import axiosClient from '../configs/axiosClient';

const payment = (payload) => {
  return axiosClient.post(`/payment/payment`, payload);
};

const getAllPackage = () => {
  return axiosClient.get('/query/package/all');
};

export { getAllPackage, payment };
