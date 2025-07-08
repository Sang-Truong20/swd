import axiosClient from '../configs/axiosClient';

const lawsService = {
  // Lấy tất cả văn bản pháp luật
  getAllLaws: async () => {
    const response = await axiosClient.get('/api/v1/query/laws');
    return response;
  },

  // Lấy chi tiết một văn bản pháp luật
  getLawById: async (id) => {
    const response = await axiosClient.get(`/api/v1/query/laws/${id}`);
    return response;
  },

  // Tìm kiếm văn bản pháp luật
  searchLaws: async (params) => {
    const response = await axiosClient.get('/api/v1/query/laws/search', { params });
    return response;
  },

  // Lấy văn bản pháp luật theo loại
  getLawsByType: async (typeId) => {
    const response = await axiosClient.get(`/api/v1/query/laws/type/${typeId}`);
    return response;
  },

  // Lấy văn bản pháp luật theo trạng thái
  getLawsByStatus: async (status) => {
    const response = await axiosClient.get(`/api/v1/query/laws/status/${status}`);
    return response;
  },

  // Lấy các loại văn bản pháp luật
  getLawTypes: async () => {
    const response = await axiosClient.get('/api/v1/query/law-types');
    return response;
  }
};

export default lawsService;
