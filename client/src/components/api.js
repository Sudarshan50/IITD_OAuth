import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`, // Optional: set the base URL for API requests
    timeout: 5000, // Optional: specify a timeout in milliseconds
    headers: { "Content-Type": "application/json" }, // Optional: specify default headers
});

// Add a request interceptor to set the Authorization header from cookies
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("adminToken");
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
