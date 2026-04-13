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
        const token = localStorage.getItem('efms_token');
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
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login page
            localStorage.removeItem('efms_token');
            localStorage.removeItem('efms_user');
            // Use window.location to navigate outside the React component tree
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
