import apiClient from "./axios";

export type AdminUserStatus = "ACTIVE" | "BLOCKED";
export type AdminUserId = number | string;

export interface UpdateAdminUserStatusPayload {
	status: AdminUserStatus;
}

export interface AdminUser {
	id?: AdminUserId;
	ID?: AdminUserId;
	rowKey?: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	email: string;
	role: string;
	status: AdminUserStatus;
	userId?: AdminUserId;
	_id?: AdminUserId;
}

const getAuthHeaders = (token: string | null) => {
	return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const getAllUsers = async () => {
	const response = await apiClient.get<AdminUser[]>("/admin/users");
	return response.data.map((user) => ({
		...user,
		rowKey: user.rowKey ?? `${user.id ?? user.ID ?? user.userId ?? user._id ?? user.email ?? 'user'}-${user.email ?? 'unknown'}`,
		id: user.id ?? user.ID ?? user.userId ?? user._id,
	}));
};

export const updateUserStatus = async (
	userId: AdminUserId,
	payload: UpdateAdminUserStatusPayload,
	token: string | null
) => {
	const response = await apiClient.put<AdminUser>(`/admin/users/${userId}/status`, payload, {
		headers: getAuthHeaders(token),
	});
	return response.data;
};