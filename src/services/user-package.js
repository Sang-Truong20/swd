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

const getUserPackageHistory = (userId, pageable) => {
  return axiosClient.get(`/query/package/user/history/${userId}`, {
    params: pageable,
    paramsSerializer: (params) => {
      const query = new URLSearchParams();
      for (const key in params) {
        if (Array.isArray(params[key])) {
          params[key].forEach((val) => query.append(key, val));
        } else {
          query.append(key, params[key]);
        }
      }
      return query.toString();
    },
  });
};

const getUserPackageActive = (userId) => {
  return axiosClient.get(`/query/package/user/active/${userId}`);
};

const createPackageAfterPayment = (payload) => {
  return axiosClient.post(`/command/user-package`, payload);
};

export {
  createPackageAfterPayment,
  getUserPackage,
  getUserPackageActive,
  getUserPackageExpired,
  getUserPackageHistory,
  getUserPackageSearch,
};
