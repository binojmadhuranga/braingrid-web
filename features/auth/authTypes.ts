export interface AuthUser {
	id: number;
	name: string;
	email: string;
}

export interface AuthState {
	user: AuthUser | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	message: string | null;
}
