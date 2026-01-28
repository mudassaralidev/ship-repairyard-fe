// src/api/dataApi.js
import axios from "axios";

const dataApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
  headers: {"Content-Type": "application/json"}
});

dataApi.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("serviceToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

dataApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const {response} = error;
    if (response && response.status === 401) {
      window.location = "/dashboard/welcome";
    }
    return Promise.reject(error);
  }
);

export default dataApi;
