import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://localhost:8080/api",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	if (typeof window === "undefined") {
		return config;
	}

	const token = window.localStorage.getItem("braingrid_token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default apiClient;
