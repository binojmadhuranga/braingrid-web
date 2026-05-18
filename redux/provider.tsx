"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateAuthFromStorage } from "@/features/auth/authSlice";
import { store } from "./store";

if (typeof window !== "undefined") {
	const rawAuth = window.localStorage.getItem("braingrid_auth");

	if (rawAuth) {
		try {
			const parsedAuth = JSON.parse(rawAuth) as {
				token?: string;
				user?: {
					id: number;
					name: string;
					email: string;
					role: string;
				};
			};

			if (parsedAuth.token) {
				store.dispatch(
					hydrateAuthFromStorage({
						token: parsedAuth.token,
						user: parsedAuth.user ?? null,
					})
				);
			}
		} catch {
			window.localStorage.removeItem("braingrid_auth");
		}
	}
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
