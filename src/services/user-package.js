import axiosClient from '../configs/axiosClient';

const getUserPackage = () => {
  return axiosClient.get(`/query/package/user`);
};
const getUserPackageSearch = () => {
  return axiosClient.get(`/query/package/user/search`);
};

const getUserPackageExpired = () => {
  return axiosClient.get(`/query/package/user/expired`);
};

const getUserPackageHistory = (userId) => {
  return axiosClient.get(`/query/package/user/history/${userId}`);
};

const getUserPackageActive = (userId) => {
  return axiosClient.get(`/query/package/user/active/${userId}`);
};

export {
  getUserPackage,
  getUserPackageActive,
  getUserPackageExpired,
  getUserPackageHistory,
  getUserPackageSearch,
};
