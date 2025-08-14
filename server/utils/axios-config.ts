/**
 * Cấu hình axios cho server-side
 */

import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    timeout: 10000, // 10 giây timeout
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AutoTranslation/1.0)',
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`🌐 Making request to: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from: ${response.config.url} (${response.status})`);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;
