import api from './api';

export const getUsers = async (role = '') => {
  const response = await api.get('/users', { params: { role } });
  return response.data;
};
