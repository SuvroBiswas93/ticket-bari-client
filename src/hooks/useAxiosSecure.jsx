import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

const useAxiosSecure = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // REQUEST INTERCEPTOR
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async config => {
        if (user) {
          // Get fresh Firebase ID token
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    const responseInterceptor = axiosInstance.interceptors.response.use(
      res => res,
      async error => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          await logOut();
          navigate('/auth/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
