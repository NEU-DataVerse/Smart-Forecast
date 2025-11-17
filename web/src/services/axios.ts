import axios from 'axios';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

// User service instance
const userAxios = axios.create({
  baseURL: `${USER_SERVICE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor để xử lý 401 errors
userAxios.interceptors.response.use(
  (response) => {
    // Trả về response nếu thành công
    return response;
  },
  (error) => {
    // Kiểm tra nếu response có status 401
    if (error.response?.status === 401) {
      // Chỉ redirect nếu không phải đang ở trang auth
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const authPaths = ['/login', '/register', '/verify-account'];

        // Chỉ redirect nếu không ở trang auth
        if (!authPaths.includes(currentPath)) {
          window.location.href = '/login';
        }
      }
    }

    // Reject promise để các component vẫn có thể handle error
    return Promise.reject(error);
  }
);

export { userAxios };
