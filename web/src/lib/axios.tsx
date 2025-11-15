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

export { userAxios };
