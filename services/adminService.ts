import apiClient from "./axios";

export interface AdminUser {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

export const getAllUsers = async () => {
	const response = await apiClient.get<AdminUser[]>("/admin/users");
	return response.data;
};