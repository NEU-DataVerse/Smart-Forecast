import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
if (token) {
  ApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor để xử lý 401 errors
ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Kiểm tra nếu response có status 401
    if (error.response?.status === 401) {
      // Clear auth data on 401
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        delete ApiClient.defaults.headers.common['Authorization'];
      }
      // Let UserContext handle the redirect through isAuthenticated state
    }

    // Reject promise để các component vẫn có thể handle error
    return Promise.reject(error);
  },
);

export { ApiClient };
