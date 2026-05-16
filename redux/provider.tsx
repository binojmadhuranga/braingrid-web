"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateAuthFromStorage } from "@/features/auth/authSlice";
import { store } from "./store";

if (typeof window !== "undefined") {
	const token = window.localStorage.getItem("braingrid_token");

	if (token) {
		store.dispatch(hydrateAuthFromStorage({ token, user: null }));
	}
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
