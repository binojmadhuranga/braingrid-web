import apiClient from "./axios";

export type AdminUserStatus = "ACTIVE" | "BLOCKED";

export interface UpdateAdminUserStatusPayload {
	status: AdminUserStatus;
}

export interface AdminUser {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	email: string;
	role: string;
	status: AdminUserStatus;
}

export const getAllUsers = async () => {
	const response = await apiClient.get<AdminUser[]>("/admin/users");
	return response.data;
};

export const updateUserStatus = async (userId: number, payload: UpdateAdminUserStatusPayload) => {
	const response = await apiClient.put<AdminUser>(`/admin/users/${userId}/status`, payload);
	return response.data;
};