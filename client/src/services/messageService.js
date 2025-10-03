import api from './api';

export const getMessages = (conversationId, { limit = 50, before } = {}) => {
  const params = { conversationId, limit };
  if (before) params.before = before; 
  return api.get('/messages', { params });
};

export const sendMessage = ({ conversationId, text }) =>api.post('/messages', { conversationId, text });