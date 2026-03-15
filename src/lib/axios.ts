import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add logic here to inject the auth token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.status) {
            if (response.data.status === 200) {
                return response;
            }
            if (response.data.status >= 400) {
                console.error(response.data.message);
                return Promise.reject(response.data);
            }
        }
        return response;
    },
    (error) => {
        // Handle global errors here, e.g. 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Redirect to login or refresh token
            console.error('Unauthorized access - redirecting to login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
