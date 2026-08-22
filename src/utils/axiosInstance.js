import axios from 'axios';

const api = axios.create({
  // خوندن آدرس بک‌اند در پروژه‌های Vite
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json'
  }
});

// ارسال خودکار توکن برای مسیرهایی که نیاز به احراز هویت دارن
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;