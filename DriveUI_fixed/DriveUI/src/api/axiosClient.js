import axios from 'axios';

// Point this at your real backend via .env → VITE_API_BASE_URL=http://localhost:8080
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivex-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[DriveX API error]', err?.response?.status, err?.message);

    // Expired/invalid token: clear session and send the user back to login
    // instead of letting every subsequent request silently fail.
    if (err?.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('drivex-token');
      localStorage.removeItem('drivex-refresh-token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
