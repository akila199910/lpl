// services/userService.js
import api from "./api";

export default {
  getUserData: (data) => api.post('/users/my-profile', data),
};

export const getUserByName = (name) =>
  api.get(`/users/${name}`);