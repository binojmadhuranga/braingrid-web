"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectAuthRole, selectAuthToken } from "@/features/auth/authSelectors";
import { useAppSelector } from "@/redux/hooks";

function getDashboardRoute(role: string | null) {
  return role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
}

export default function DashboardPage() {
  const router = useRouter();
  const token = useAppSelector(selectAuthToken);
  const role = useAppSelector(selectAuthRole);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    router.replace(getDashboardRoute(role));
  }, [router, role, token]);

  return (
      <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-4 text-sm text-slate-300 shadow-2xl shadow-black/30 backdrop-blur-xl">
          Redirecting to your dashboard...
        </div>
      </main>
  );
}