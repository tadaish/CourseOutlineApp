import axios from "axios";

const BASE_URL = "http://192.168.1.7:8000/";

export const endpoints = {
  categories: "/categories/",
  courses: "/courses/",
  register: "/users/",
  login: "/o/token/",
  current_user: "/users/current-user/",
};

export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
