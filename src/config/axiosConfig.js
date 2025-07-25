import axios from 'axios';
import { SERVER_ADDRESS } from './constant';
import store from '../store/store';

const axiosInstance = axios.create({
  baseURL: SERVER_ADDRESS
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      // const decoded = jwtDecode(token);
      config.headers.Authorization = `Bearer ${token}`;
      // if (decoded && decoded.data) {
      //   config.headers.userid = decoded.data.id;
      //   config.headers.username = decoded.data.username;
      // }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
