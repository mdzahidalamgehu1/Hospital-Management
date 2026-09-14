import axios from "axios";

const api = axios.create({
  baseURL: process.env.API,
  withCredentials: true,
});
export default api;