"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { registerThunk, clearAuthFeedback } from "@/features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
} from "@/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = window.setTimeout(() => {
        router.replace("/login");
      }, 900);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [message, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(registerThunk({ name, email, password }));

    if (registerThunk.fulfilled.match(result)) {
      router.replace("/login");
    }
  };

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Register</h1>
        <p className="mt-2 text-sm text-slate-300">
          Create your BrainGrid account in a few seconds.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm text-slate-200">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Binoj"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/8"
              required
            />
          </label>

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
              placeholder="123456"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/8"
              required
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}