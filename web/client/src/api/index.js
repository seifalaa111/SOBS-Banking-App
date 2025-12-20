import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // If 401, redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default api;
