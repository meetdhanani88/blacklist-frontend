import axios from "axios";
//const baseURL = "http://192.168.100.29:7600/api";
const baseURL = "https://vendorblacklist.herokuapp.com/api";
const token = localStorage.getItem("token");
export const imgurl = "https://vendorblacklist.herokuapp.com";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: token ? `Bearer ${localStorage.getItem("token")}` : "",
  },
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${localStorage.getItem("token")}` : "";
  return config;
});

export default axiosInstance;
