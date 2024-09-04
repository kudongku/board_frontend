import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 API 서버 주소
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bearerToken'); // 예: 로컬 스토리지에서 토큰 가져오기

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
