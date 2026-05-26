"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/features/auth/authSlice";
import { selectAuthRole, selectAuthToken } from "@/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllUsers, type AdminUser, updateUserStatus } from "@/services/adminService";

const metrics = [
	{ label: "Active users", value: "1,284", delta: "+12%" },
	{ label: "New signups", value: "84", delta: "+8" },
	{ label: "Open tickets", value: "13", delta: "-4" },
	{ label: "Uptime", value: "99.98%", delta: "Stable" },
];

const alerts = [
	"2 payment retries need review",
	"Weekly analytics report is ready",
	"Storage usage reached 72%",
];

export default function AdminDashboardPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const token = useAppSelector(selectAuthToken);
	const role = useAppSelector(selectAuthRole);
	const [isHydrated, setIsHydrated] = useState(false);
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [isUsersLoading, setIsUsersLoading] = useState(false);
	const [usersError, setUsersError] = useState<string | null>(null);
	const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
	const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

	const activeUsersCount = users.filter((user) => user.status === "ACTIVE").length;

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (!token) {
			router.replace("/login");
			return;
		}

		if (role && role !== "ADMIN") {
			router.replace("/dashboard/user");
		}
	}, [router, role, token]);

	useEffect(() => {
		if (!token || role !== "ADMIN") {
			return;
		}

		let isActive = true;

		const loadUsers = async () => {
			setIsUsersLoading(true);
			setUsersError(null);
			setStatusUpdateError(null);

			try {
				const response = await getAllUsers();
				if (isActive) {
					setUsers(response);
				}
			} catch {
				if (isActive) {
					setUsersError("Unable to load users right now.");
				}
			} finally {
				if (isActive) {
					setIsUsersLoading(false);
				}
			}
		};

		void loadUsers();

		return () => {
			isActive = false;
		};
	}, [role, token]);

	const handleLogout = () => {
		dispatch(logout());
		router.replace("/login");
	};

	const handleStatusToggle = async (user: AdminUser) => {
		const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

		setUpdatingUserId(user.id);
		setStatusUpdateError(null);

		try {
			const updatedUser = await updateUserStatus(user.id, { status: nextStatus });
			setUsers((currentUsers) =>
				currentUsers.map((currentUser) => (currentUser.id === user.id ? updatedUser : currentUser))
			);
		} catch {
			setStatusUpdateError("Unable to update this user's status right now.");
		} finally {
			setUpdatingUserId(null);
		}
	};

	const formatStatusLabel = (status: AdminUser["status"]) => {
		return status === "ACTIVE" ? "Active" : "Blocked";
	};

	return (
		<main className="auth-shell min-h-screen px-6 py-12">
			<div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
				<div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
							Admin Dashboard
						</p>
						<h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
							Operations overview
						</h1>
						<p className="mt-2 max-w-2xl text-slate-300">
							Sample admin view for monitoring the platform, reviewing queues, and keeping an eye on system activity.
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

				<section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{metrics.map((metric) => (
						<div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
							<p className="text-sm text-slate-400">{metric.label}</p>
							<div className="mt-3 flex items-end justify-between gap-3">
								<span className="text-3xl font-semibold text-white">{metric.value}</span>
								<span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
									{metric.delta}
								</span>
							</div>
						</div>
					))}
					<div className="rounded-3xl border border-white/10 bg-white/5 p-5">
						<p className="text-sm text-slate-400">Active users</p>
						<div className="mt-3 flex items-end justify-between gap-3">
							<span className="text-3xl font-semibold text-white">{isUsersLoading ? "..." : activeUsersCount}</span>
							<span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
								Live
							</span>
						</div>
					</div>
				</section>

				<section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
							<h2 className="text-xl font-semibold text-white">All users</h2>
							<span className="text-sm text-slate-400">GET /api/admin/users</span>
						</div>
							{statusUpdateError ? (
								<div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
									{statusUpdateError}
								</div>
							) : null}
						{usersError ? (
								<div className={`${statusUpdateError ? "mt-4" : "mt-5"} rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200`}>
								{usersError}
							</div>
						) : isUsersLoading ? (
								<div className={`${statusUpdateError || usersError ? "mt-4" : "mt-5"} rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300`}>
								Loading users...
							</div>
						) : users.length === 0 ? (
								<div className={`${statusUpdateError || usersError ? "mt-4" : "mt-5"} rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300`}>
								No users found.
							</div>
						) : (
								<div className={`${statusUpdateError || usersError ? "mt-4" : "mt-5"} overflow-hidden rounded-2xl border border-white/10`}>
								<table className="w-full border-collapse text-left text-sm">
									<thead className="bg-slate-900/80 text-slate-300">
										<tr>
											<th className="px-4 py-3 font-medium">Name</th>
											<th className="px-4 py-3 font-medium">Email</th>
											<th className="px-4 py-3 font-medium">Role</th>
											<th className="px-4 py-3 font-medium">Status</th>
												<th className="px-4 py-3 font-medium">Action</th>
										</tr>
									</thead>
									<tbody>
										{users.map((user) => (
											<tr key={`${user.id}-${user.email}`} className="border-t border-white/10 bg-slate-950/50 text-slate-200">
												<td className="px-4 py-3 font-medium text-white">{user.name}</td>
												<td className="px-4 py-3">{user.email}</td>
												<td className="px-4 py-3">{user.role}</td>
												<td className="px-4 py-3">
														<span className={`rounded-full px-3 py-1 text-xs font-medium ${user.status === "ACTIVE" ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}`}>
															{formatStatusLabel(user.status)}
													</span>
												</td>
													<td className="px-4 py-3">
														<button
															type="button"
															onClick={() => void handleStatusToggle(user)}
															disabled={updatingUserId === user.id}
															className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
														>
															{updatingUserId === user.id
																? "Updating..."
																: user.status === "ACTIVE"
																	? "Block user"
																	: "Activate user"}
														</button>
													</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					<aside className="space-y-6">
						<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-xl font-semibold text-white">System alerts</h2>
							<div className="mt-5 space-y-3">
								{alerts.map((alert) => (
									<div key={alert} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
										{alert}
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-xl font-semibold text-white">Recent activity</h2>
							<div className="mt-5 space-y-4">
								{[
									["New enterprise subscription", "Acme Corp upgraded to Pro"],
									["Support queue", "3 tickets assigned to the billing team"],
									["Security scan", "No critical issues detected"],
								].map(([title, description]) => (
									<article key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
										<h3 className="font-medium text-white">{title}</h3>
										<p className="mt-1 text-sm text-slate-300">{description}</p>
									</article>
								))}
							</div>
						</div>
					</aside>
				</section>
			</div>
		</main>
	);
}
