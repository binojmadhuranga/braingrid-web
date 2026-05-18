"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { loginThunk, clearAuthFeedback } from "@/features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthToken,
  selectAuthUser,
} from "@/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

function getDashboardRoute(role?: string | null) {
  return role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const token = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectAuthUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      router.replace(getDashboardRoute(user?.role));
    }
  }, [router, token, user?.role]);

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      const role = result.payload.user.role;
      router.replace(getDashboardRoute(role));
    }
  };

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/BrainGridLogo.png"
            alt="BrainGrid Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Use your email and password to access your dashboard.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm text-slate-200">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="binoj@gmail.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/8"
              required
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/8"
              required
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          New here?{" "}
          <Link href="/register" className="text-cyan-300 hover:text-cyan-200">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}