import { Link } from "react-router-dom";

export default function Footer({ theme }) {
  const shellClass = theme === "light" ? "border-slate-200 bg-slate-50 text-slate-700" : "border-slate-800 bg-[#1a1a1a]/90 text-slate-400";
  const linkClass = theme === "light" ? "transition hover:text-slate-900" : "transition hover:text-white";

  return (
    <footer className={`border-t py-8 ${shellClass}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
            Coder Arena
          </p>
          <p className={`mt-2 text-sm ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            A modern coding platform built for competitive developers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/problems" className={linkClass}>
            Problems
          </Link>
          <Link to="/contests" className={linkClass}>
            Contests
          </Link>
          <Link to="/multiplayer" className={linkClass}>
            Multiplayer
          </Link>
          <Link to="/interview" className={linkClass}>
            AI Assistant
          </Link>
        </div>
      </div>
    </footer>
  );
}
