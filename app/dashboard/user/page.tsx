"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import { selectAuthToken, selectAuthUser } from "@/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const tasks = [
	{ title: "Complete profile", status: "70%" },
	{ title: "Review notifications", status: "4 new" },
	{ title: "Check saved items", status: "12" },
];

const milestones = [
	"Login streak: 8 days",
	"Profile badge earned",
	"2 workflows completed this week",
];

export default function UserDashboardPage() {
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
		<main className="auth-shell min-h-screen px-6 py-12">
			<div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
				<div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
							User Dashboard
						</p>
						<h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
							{user ? `Welcome back, ${user.name}` : "Your personal workspace"}
						</h1>
						<p className="mt-2 max-w-2xl text-slate-300">
							Sample user view for tracking daily progress, tasks, and account activity.
						</p>
					</div>

					<div className="flex gap-3">
						<Link
							href="/dashboard"
							className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
						>
							Back
						</Link>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
						>
							Logout
						</button>
					</div>
				</div>

				<section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<h2 className="text-xl font-semibold text-white">Today’s focus</h2>
						<div className="mt-5 space-y-4">
							{tasks.map((task) => (
								<article key={task.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
									<div className="flex items-center justify-between gap-4">
										<h3 className="font-medium text-white">{task.title}</h3>
										<span className="text-sm text-cyan-200">{task.status}</span>
									</div>
									<div className="mt-3 h-2 rounded-full bg-white/10">
										<div className="h-2 rounded-full bg-cyan-400" style={{ width: task.status === "70%" ? "70%" : task.status === "4 new" ? "45%" : "85%" }} />
									</div>
								</article>
							))}
						</div>
					</div>

					<aside className="space-y-6">
						<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-xl font-semibold text-white">Profile snapshot</h2>
							<div className="mt-5 space-y-3 text-sm text-slate-300">
								<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
									<span>Email</span>
									<span className="text-white">{user?.email ?? "binoj@gmail.com"}</span>
								</div>
								<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
									<span>Membership</span>
									<span className="text-white">Standard</span>
								</div>
								<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
									<span>Notifications</span>
									<span className="text-white">Enabled</span>
								</div>
							</div>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-xl font-semibold text-white">Milestones</h2>
							<div className="mt-5 space-y-3">
								{milestones.map((milestone) => (
									<div key={milestone} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
										{milestone}
									</div>
								))}
							</div>
						</div>
					</aside>
				</section>
			</div>
		</main>
	);
}
