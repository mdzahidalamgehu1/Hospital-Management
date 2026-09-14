import axios from "axios";

const api = axios.create({
  baseURL: "https://hospital-management-siru.onrender.com/api",
  withCredentials: true,
});
export default api;