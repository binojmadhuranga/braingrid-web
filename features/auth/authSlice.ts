import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "./authTypes";
import {
	loginUser,
	registerUser,
	type LoginPayload,
	type RegisterPayload,
} from "@/services/authService";

const tokenStorageKey = "braingrid_token";

const initialState: AuthState = {
	user: null,
	token: null,
	isLoading: false,
	error: null,
	message: null,
};

export const registerThunk = createAsyncThunk(
	"auth/register",
	async (payload: RegisterPayload, { rejectWithValue }) => {
		try {
			return await registerUser(payload);
		} catch (error) {
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const loginThunk = createAsyncThunk(
	"auth/login",
	async (payload: LoginPayload, { rejectWithValue }) => {
		try {
			return await loginUser(payload);
		} catch (error) {
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		hydrateAuthFromStorage(
			state,
			action: { payload: { token: string | null; user: AuthUser | null } }
		) {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		logout(state) {
			state.user = null;
			state.token = null;
			state.error = null;
			state.message = null;

			if (typeof window !== "undefined") {
				window.localStorage.removeItem(tokenStorageKey);
			}
		},
		clearAuthFeedback(state) {
			state.error = null;
			state.message = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(registerThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(registerThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) ?? "Registration failed";
			})
			.addCase(loginThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(loginThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.token = action.payload.token;
				state.user = action.payload.user;
				state.message = "Login successful";

				if (typeof window !== "undefined") {
					window.localStorage.setItem(tokenStorageKey, action.payload.token);
				}
			})
			.addCase(loginThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) ?? "Login failed";
			});
	},
});

function getErrorMessage(error: unknown) {
	if (typeof error === "object" && error !== null && "response" in error) {
		const response = (error as { response?: { data?: { message?: string } } }).response;
		return response?.data?.message ?? "Something went wrong";
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Something went wrong";
}

export const { hydrateAuthFromStorage, logout, clearAuthFeedback } = authSlice.actions;
export default authSlice.reducer;
