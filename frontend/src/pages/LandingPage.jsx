import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import BackgroundPaths from "../components/ui/background-paths";

export default function LandingPage() {
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [problemRes, contestRes, userCountRes] = await Promise.all([
          fetch(`${API_URL}/api/problems`),
          fetch(`${API_URL}/api/contests`),
          fetch(`${API_URL}/api/user/count`)
        ]);

        const problemData = problemRes.ok ? await problemRes.json() : [];
        const contestData = contestRes.ok ? await contestRes.json() : [];
        const userCountData = userCountRes.ok ? await userCountRes.json() : { count: 0 };

        setProblems(Array.isArray(problemData) ? problemData : []);
        setContests(Array.isArray(contestData) ? contestData : []);
        setUsersCount(typeof userCountData.count === "number" ? userCountData.count : 0);
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
    { label: "Created Accounts", value: usersCount },
  ];

  const latestProblem = problems[0];
  const upcomingContest = contests.find((item) => new Date(item.startTime) > new Date());
  const liveContest = contests.find((item) => {
    const now = new Date();
    return new Date(item.startTime) <= now && now <= new Date(item.endTime);
  });

  return (
    <div className="bg-[#1a1a1a]">
      {/* Hero Section with Animated Background Paths */}
      <BackgroundPaths
        title="Coder Arena"
        subtitle="Solve problems, compete in contests, and level up your coding craft."
        buttonText="Start Coding"
        buttonLink="/problems"
      />

      {/* Scrolling Dashboard Preview */}
      <div className="bg-[#1a1a1a]">
        <ContainerScroll
          titleComponent={
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-blue-300">
                PLATFORM OVERVIEW
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Everything you need to <br />
                <span className="mt-1 text-4xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 md:text-[6rem]">
                  level up
                </span>
              </h2>
            </div>
          }
        >
          {/* Dashboard Preview Card inside the 3D scroll container */}
          <div className="flex h-full flex-col gap-4 bg-[#1a1a1a] p-4 md:p-8">
            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-[#282828] border border-[#3e3e3e]/30 p-5 text-left">
                  <p className="text-3xl font-semibold text-white">{loading ? "..." : item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Featured Challenge */}
            {latestProblem ? (
              <Link
                to={`/problems/${latestProblem._id}`}
                className="block rounded-2xl bg-[#282828] border border-[#3e3e3e]/30 p-5 transition hover:border-blue-500/50"
              >
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Featured challenge</span>
                  <span className="rounded-full bg-[#3e3e3e] px-3 py-1 text-xs text-slate-200">
                    {latestProblem.difficulty}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">{latestProblem.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {latestProblem.statement?.slice(0, 120) || "Explore the latest coding challenge when the platform loads."}
                </p>
              </Link>
            ) : (
              <div className="rounded-2xl bg-[#282828] border border-[#3e3e3e]/30 p-5">
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="text-xs uppercase tracking-[0.2em]">Featured challenge</span>
                  <span className="rounded-full bg-[#3e3e3e] px-3 py-1 text-xs text-slate-200">—</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">No problem loaded yet</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Explore the latest coding challenge when the platform loads.
                </p>
              </div>
            )}

            {/* Contests Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#3e3e3e]/30 bg-[#282828] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Upcoming contest</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{upcomingContest?.title || "No upcoming contest"}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {upcomingContest ? new Date(upcomingContest.startTime).toLocaleString() : "Check back later for the next live event."}
                </p>
              </div>
              <div className="rounded-2xl border border-[#3e3e3e]/30 bg-[#282828] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Live contest</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{liveContest?.title || "No live contest"}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {liveContest ? "Join the competition now and prove your skills." : "Await the next arena challenge."}
                </p>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* Feature Cards */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-[#3e3e3e]/30 bg-[#282828] p-6 text-slate-200 shadow-xl shadow-black/10 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Why choose Coder Arena?</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">A competitive platform tailored for developers.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Designed for clarity, speed, and deep learning — Coder Arena brings polished problem workflows, live ranking, and collaborative coding into one premium experience.
            </p>
          </article>

          <article className="rounded-3xl border border-[#3e3e3e]/30 bg-[#282828] p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Interactive experience</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Engaging coding adventures.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Explore a modern UI with smart layout, dynamic challenge previews, and fluid navigation that keeps you focused on solving problems.
            </p>
          </article>

          <article className="rounded-3xl border border-[#3e3e3e]/30 bg-[#282828] p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1">
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
