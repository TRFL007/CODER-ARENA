import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function LandingPage() {
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [problemRes, contestRes] = await Promise.all([
          fetch(`${API_URL}/api/problems`),
          fetch(`${API_URL}/api/contests`),
        ]);

        const problemData = problemRes.ok ? await problemRes.json() : [];
        const contestData = contestRes.ok ? await contestRes.json() : [];

        setProblems(Array.isArray(problemData) ? problemData : []);
        setContests(Array.isArray(contestData) ? contestData : []);
      } catch (err) {
        console.error("LandingPage load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = [
    { label: "Challenges", value: problems.length },
    { label: "Contests", value: contests.length },
    { label: "Active Members", value: Math.max(3400, problems.length * 8) },
  ];

  const latestProblem = problems[0];
  const upcomingContest = contests.find((item) => new Date(item.startTime) > new Date());
  const liveContest = contests.find((item) => {
    const now = new Date();
    return new Date(item.startTime) <= now && now <= new Date(item.endTime);
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-blue-300">
              LIVE CODING ARENA
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Solve problems, compete in contests, and level up your coding craft.
            </h1>
            <p className="max-w-2xl text-slate-300 sm:text-lg">
              {loading
                ? "Loading platform insights..."
                : `Explore ${stats[0].value} challenges and ${stats[1].value} contests on a polished, developer-first platform.`}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/problems"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Browse Problems
              </Link>
              <Link
                to="/contests"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              >
                View Contests
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_20%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-sm shadow-slate-950/20">
                  Platform pulse
                </div>
                <div className="space-y-3">
                  <div className="rounded-3xl bg-slate-950/90 p-5 shadow-[0_20px_120px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <span className="text-xs uppercase tracking-[0.2em]">Featured challenge</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                        {latestProblem?.difficulty || "—"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-white">{latestProblem?.title || "No problem loaded yet"}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {latestProblem?.statement?.slice(0, 120) || "Explore the latest coding challenge when the platform loads."}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {stats.map((item) => (
                      <div key={item.label} className="rounded-3xl bg-slate-950/90 p-4 text-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:bg-slate-900/95">
                        <p className="text-3xl font-semibold text-white">{item.value}</p>
                        <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 transition hover:border-blue-500/50 hover:bg-slate-800/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Upcoming contest</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{upcomingContest?.title || "No upcoming contest"}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {upcomingContest ? new Date(upcomingContest.startTime).toLocaleString() : "Check back later for the next live event."}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 transition hover:border-emerald-500/50 hover:bg-slate-800/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Live contest</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{liveContest?.title || "No live contest"}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {liveContest ? "Join the competition now and prove your skills." : "Await the next arena challenge."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 text-slate-200 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Why choose Coder Arena?</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">A competitive platform tailored for developers.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Designed for clarity, speed, and deep learning — Coder Arena brings polished problem workflows, live ranking, and collaborative coding into one premium experience.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Interactive experience</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Engaging coding adventures.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Explore a modern UI with smart layout, dynamic challenge previews, and fluid navigation that keeps you focused on solving problems.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-green-300">Get started quickly</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Build your streak and improve daily.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Keep track of your progress, rank higher in contests, and collaborate with friends through clean, responsive dashboards.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
