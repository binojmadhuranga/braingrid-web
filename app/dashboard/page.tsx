"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectAuthToken } from "@/features/auth/authSelectors";
import { useAppSelector } from "@/redux/hooks";

export default function DashboardPage() {
  const router = useRouter();
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Dashboard Hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          Choose a sample dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          These routes demonstrate role-based dashboard screens for admin and user experiences.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/admin"
            className="group rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/15"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">
              Admin
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Control center
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Review system health, member activity, revenue trends, and pending approvals.
            </p>
            <span className="mt-5 inline-flex text-sm font-medium text-cyan-300 group-hover:text-cyan-200">
              Open admin dashboard →
            </span>
          </Link>

          <Link
            href="/dashboard/user"
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">
              User
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Personal workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Track profile completion, recent tasks, notifications, and your daily progress.
            </p>
            <span className="mt-5 inline-flex text-sm font-medium text-cyan-300 group-hover:text-cyan-200">
              Open user dashboard →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}