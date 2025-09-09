import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

interface RequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig;

        if (error.response?.status !== 401 || originalRequest._retry || isRefreshing) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await api.post("/auth/refresh-token", {}, { withCredentials: true });
            const { accessToken } = response.data;

            Cookies.set("accessToken", accessToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return api(originalRequest);
        } catch {
            Cookies.remove("accessToken");
            window.location.href = "/login";
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;