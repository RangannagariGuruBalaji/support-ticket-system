import api from './api';

export const getComments = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return response.data;
};

export const addComment = async (ticketId, commentText) => {
  const response = await api.post(`/tickets/${ticketId}/comments`, { comment: commentText });
  return response.data;
};
