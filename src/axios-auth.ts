import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

function getAuthToken(): string | null {
    return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
}

function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
}

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.51:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await axiosInstance.post('/auth/token/refresh/', {
                    refresh: refreshToken
                });

                const { access } = response.data;
                setTokens(access, refreshToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                }

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
    