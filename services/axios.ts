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

	const rawAuth = window.localStorage.getItem("braingrid_auth");
	const legacyToken = window.localStorage.getItem("braingrid_token");
	let token: string | null = legacyToken;

	if (rawAuth) {
		try {
			const parsedAuth = JSON.parse(rawAuth) as { token?: string };
			token = parsedAuth.token ?? token;
		} catch {
			window.localStorage.removeItem("braingrid_auth");
		}
	}

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default apiClient;
