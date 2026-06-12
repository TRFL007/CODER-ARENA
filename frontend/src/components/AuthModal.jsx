import { Link } from "react-router-dom";

export default function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 text-slate-100 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Login Required
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Create a free account to continue</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-400">
          You can preview challenges and explore the platform as a guest. Login or register to unlock compile, submit, and multiplayer features.
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block rounded-2xl bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
