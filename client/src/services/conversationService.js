import api from './api';
export const createOrGetDM = (receiver) =>
    api.post('/conversations/dm', { receiver });