import apiClient from "./axios";

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: {
		email: string;
		id: number;
		name: string;
	};
}

export interface RegisterResponse {
	message: string;
}

export const registerUser = async (payload: RegisterPayload) => {
	const response = await apiClient.post<RegisterResponse>("/auth/register", payload);
	return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
	const response = await apiClient.post<LoginResponse>("/auth/login", payload);
	return response.data;
};
