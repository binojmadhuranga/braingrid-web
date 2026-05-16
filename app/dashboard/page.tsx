"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import { selectAuthToken, selectAuthUser } from "@/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          {user ? `Hello, ${user.name}` : "You're signed in"}
        </h1>
        <p className="mt-3 text-slate-300">
          Your token is stored in Redux and local storage so the app can keep the session.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Logout
          </button>
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}