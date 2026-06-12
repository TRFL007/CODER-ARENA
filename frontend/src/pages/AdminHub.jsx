import { Link } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config/api";

export default function AdminHub() {
  const [seedStatus, setSeedStatus] = useState("");
  const [seeding, setSeeding] = useState(false);

  const seedQuestions = async () => {
    try {
      setSeeding(true);
      setSeedStatus("");
      const res = await fetch(`${API_URL}/api/problems/seed`, { method: "POST" });
      const data = await res.json();
      setSeedStatus(
        res.ok
          ? `✅ ${data.message} (${data.inserted} added)`
          : `❌ ${data.error || "Seed failed"}`
      );
    } catch (err) {
      console.error(err);
      setSeedStatus("❌ Network error while seeding");
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    {
      title: "Manage Problems",
      description: "Create, edit, and delete coding challenges. View all problems with filtering.",
      path: "/admin/problems",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-600/5",
      borderColor: "hover:border-blue-500/50",
      iconColor: "text-blue-400"
    },
    {
      title: "Create Contest",
      description: "Set up timed competitions. Select problems, configure duration, and launch contests.",
      path: "/admin/contests",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" />
        </svg>
      ),
      color: "from-emerald-500/20 to-emerald-600/5",
      borderColor: "hover:border-emerald-500/50",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Administration</p>
          <h1 className="text-4xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-slate-400">Select an action to manage the platform.</p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className={`group relative overflow-hidden rounded-2xl border border-[#3e3e3e]/40 bg-[#282828] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${card.borderColor}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative space-y-4">
                <div className={`inline-flex rounded-xl bg-[#1a1a1a] p-3 ${card.iconColor}`}>
                  {card.icon}
                </div>
                <h2 className="text-2xl font-semibold">{card.title}</h2>
                <p className="text-sm leading-6 text-slate-400">{card.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white">
                  <span>Open</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Seed Section */}
        <div className="rounded-2xl border border-[#3e3e3e]/40 bg-[#282828] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-xl bg-[#1a1a1a] p-3 text-amber-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Seed Interview Questions</h2>
                  <p className="text-sm text-slate-400">Load the LeetCode Top 150 interview questions into the database.</p>
                </div>
              </div>
            </div>
            <button
              onClick={seedQuestions}
              disabled={seeding}
              className="shrink-0 rounded-xl bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {seeding ? "Seeding..." : "Seed 150 Questions"}
            </button>
          </div>
          {seedStatus && (
            <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${seedStatus.startsWith("✅") ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
              {seedStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
