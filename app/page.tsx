import Link from "next/link";

export default function Home() {
  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/6 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">
          BrainGrid
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
          Secure auth flow for register and login.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
          Create an account, sign in, and keep the token in Redux for the app shell.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
