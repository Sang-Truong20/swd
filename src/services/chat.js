import axiosClient from '../configs/axiosClient';

const getChatHistory = (userId) => {
  return axiosClient.get(`/query/chat-history/${userId}`);
};

const chatWithGemini = (question, userId) => {
  return axiosClient.post(`/gemini/ask?question=${question}&userId=${userId}`);
};

export { chatWithGemini, getChatHistory };
