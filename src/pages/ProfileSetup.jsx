import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const buildDateKey = (date) => {
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
};

const heatLevelClass = (count) => {
  if (count === null) return "bg-transparent border-transparent";
  if (count === 0) return "bg-[#0b1422] border-[#12203b]";
  if (count === 1) return "bg-[#0f5139] border-[#103c31]";
  if (count === 2) return "bg-[#1f8c4d] border-[#16643b]";
  if (count <= 4) return "bg-[#31c567] border-[#1f9247]";
  return "bg-[#79ff85] border-[#22c55e]";
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const badges = stats
    ? [
        {
          title: "First AC",
          description: "Solved your first accepted problem",
          icon: "✅",
          unlocked: stats.problemsSolved > 0
        },
        {
          title: "10 Problem Solver",
          description: "Solved 10 unique problems",
          icon: "🏅",
          unlocked: stats.problemsSolved >= 10
        },
        {
          title: "Weekly Warrior",
          description: "7-day active streak",
          icon: "🔥",
          unlocked: stats.longestStreak >= 7
        },
        {
          title: "Active Coder",
          description: "30 active days on the platform",
          icon: "💎",
          unlocked: stats.activeDays >= 30
        }
      ]
    : [];

  const earnedBadges = badges.filter((badge) => badge.unlocked);

  const profileLevel = stats ? stats.profileLevel : "Tier 1";
  const profileRank = stats ? `#${stats.globalRank}` : "#----";
  const profileScore = stats ? `${stats.profilePoints} pts` : "0 pts";
  const attemptingCount = stats ? stats.attemptingCount : 0;
  const difficultySummary = stats?.difficultySummary || [];

  const easyStats = difficultySummary.find((item) => item.difficulty === "Easy") || { solved: 0, total: 0 };
  const mediumStats = difficultySummary.find((item) => item.difficulty === "Medium") || { solved: 0, total: 0 };
  const hardStats = difficultySummary.find((item) => item.difficulty === "Hard") || { solved: 0, total: 0 };
  const totalProblems = stats?.totalProblems || 0;
  const solvedRatio = stats?.solvedRatio || 0;

  const easyAngle = totalProblems ? (easyStats.solved / totalProblems) * 360 : 0;
  const mediumAngle = totalProblems ? (mediumStats.solved / totalProblems) * 360 : 0;
  const hardAngle = totalProblems ? (hardStats.solved / totalProblems) * 360 : 0;
  const gaugeGradient = `conic-gradient(
    #38bdf8 0deg ${easyAngle}deg,
    #f59e0b ${easyAngle}deg ${easyAngle + mediumAngle}deg,
    #ef4444 ${easyAngle + mediumAngle}deg ${easyAngle + mediumAngle + hardAngle}deg,
    rgba(15, 23, 42, 0.75) ${easyAngle + mediumAngle + hardAngle}deg 360deg
  )`;

  const getHeatmapData = (days) => {
    if (!days || days.length === 0) return { weeks: [], weekCount: 0, monthLabels: [], boundaryWeeks: [] };

    const dayMap = new Map(days.map((item) => [item.date, item.count]));
    const startDate = new Date(days[0].date);
    const endDate = new Date(days[days.length - 1].date);

    const firstWeekStart = new Date(startDate);
    firstWeekStart.setDate(firstWeekStart.getDate() - firstWeekStart.getDay());

    const totalDays = Math.round((endDate - firstWeekStart) / (1000 * 60 * 60 * 24)) + 1;
    const weekCount = Math.ceil(totalDays / 7);

    const weeks = [];
    const monthStarts = [];
    const current = new Date(firstWeekStart);

    for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
      const daysInWeek = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
        const dateKey = buildDateKey(current);
        const visible = current >= startDate && current <= endDate;
        const count = visible ? dayMap.get(dateKey) ?? 0 : null;

        if (visible && current.getDate() === 1) {
          monthStarts.push({ label: current.toLocaleString("default", { month: "short" }), weekIndex });
        }

        daysInWeek.push({
          date: dateKey,
          count,
          visible,
          dayOfWeek
        });

        current.setDate(current.getDate() + 1);
      }
      weeks.push({ weekIndex, days: daysInWeek });
    }

    if (monthStarts.length === 0) {
      monthStarts.push({ label: startDate.toLocaleString("default", { month: "short" }), weekIndex: 0 });
    }

    if (monthStarts[0]?.weekIndex !== 0) {
      monthStarts.unshift({ label: startDate.toLocaleString("default", { month: "short" }), weekIndex: 0 });
    }

    const boundaryWeeks = monthStarts.slice(1).map((segment) => segment.weekIndex);

    const layoutColumns = [];
    for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
      if (boundaryWeeks.includes(weekIndex)) {
        layoutColumns.push({ type: "gap", key: `gap-${weekIndex}` });
      }
      layoutColumns.push({ type: "week", weekIndex, days: weeks[weekIndex].days });
    }

    const gridTemplateColumns = layoutColumns
      .map((column) => (column.type === "week" ? "0.5rem" : "0.3rem"))
      .join(" ");

    const monthLabels = monthStarts.map((segment, index) => {
      const nextSegment = monthStarts[index + 1];
      const span = Math.max(1, (nextSegment ? nextSegment.weekIndex : weekCount) - segment.weekIndex);
      const gapCountBefore = boundaryWeeks.filter((boundaryIndex) => boundaryIndex <= segment.weekIndex).length;
      return {
        ...segment,
        span,
        startColumn: segment.weekIndex + 1 + gapCountBefore
      };
    });

    return { weeks, weekCount, monthLabels, boundaryWeeks, layoutColumns, gridTemplateColumns };
  };

  const heatmap = stats
    ? getHeatmapData(stats.last365Days)
    : { weeks: [], weekCount: 0, monthLabels: [], boundaryWeeks: [], layoutColumns: [], gridTemplateColumns: "" };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/user/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to load profile stats");
        }

        setStats(data.stats);
      } catch (err) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#040b14] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-slate-800 bg-[#07101c]/95 p-8 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Profile dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{user.name || "Coder Arena"}</h1>
              <p className="mt-2 text-sm text-slate-400">A modern activity summary inspired by the top coding platforms.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center rounded-full border border-cyan-500 bg-transparent px-5 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-[#161b22]/95 p-10 text-center text-slate-400">
            Loading profile stats...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-500 bg-red-500/10 p-8 text-center text-red-200">
            {error}
          </div>
        ) : stats ? (
          <div className="grid gap-6">
            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <div className="rounded-[2rem] border border-slate-800 bg-[#111827]/95 p-6 shadow-xl shadow-black/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl font-bold text-slate-950">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Account</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{user.name || "Guest User"}</h2>
                    <p className="mt-1 text-sm text-slate-500">{user.email || "No email linked"}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-[1.5rem] bg-[#111827]/95 p-4 border border-slate-800">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Joined</p>
                    <p className="mt-2 text-lg font-semibold text-white">{new Date(user.joinedAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#111827]/95 p-4 border border-slate-800">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active days</p>
                    <p className="mt-2 text-lg font-semibold text-white">{stats.activeDays}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#111827]/95 p-4 border border-slate-800">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Problems solved</p>
                    <p className="mt-2 text-lg font-semibold text-white">{stats.problemsSolved}</p>
                  </div>
                </div>

                {earnedBadges.length > 0 && (
                  <div className="mt-8 rounded-[1.8rem] border border-slate-800 bg-[#111827]/95 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Badges</p>
                        <p className="mt-1 text-sm text-slate-500">Earned from your project progress.</p>
                      </div>
                      <div className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                        {earnedBadges.length} earned
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {earnedBadges.map((badge) => (
                        <div
                          key={badge.title}
                          className="rounded-[1.5rem] border border-emerald-500 bg-slate-900/95 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-lg text-slate-950">
                              {badge.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{badge.title}</p>
                              <p className="mt-1 text-xs text-slate-500">{badge.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-6">
                <div className="rounded-[2rem] border border-[#172438] bg-[#08111d]/95 p-5 shadow-xl shadow-black/20">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="mx-auto flex h-[16rem] w-[16rem] items-center justify-center rounded-full bg-[#07111d] border border-slate-800/70 shadow-[0_0_0_1px_rgba(148,163,184,0.05)]" style={{ background: gaugeGradient }}>
                      <div className="flex h-[13.5rem] w-[13.5rem] items-center justify-center rounded-full bg-[#040b14] shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
                        <div className="text-center">
                          <p className="text-5xl font-semibold text-white">{stats.problemsSolved}</p>
                          <p className="text-sm text-slate-400">/{totalProblems}</p>
                          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-slate-500">Solved</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3 flex-1">
                      {[
                        { label: "Easy", stats: easyStats, color: "#38bdf8" },
                        { label: "Medium", stats: mediumStats, color: "#f59e0b" },
                        { label: "Hard", stats: hardStats, color: "#ef4444" }
                      ].map((item) => (
                        <div key={item.label} className="rounded-[1.8rem] border border-slate-800 bg-[#0a1320]/95 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                          <p className="mt-3 text-3xl font-semibold text-white">
                            {item.stats.solved}/{item.stats.total}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-4 rounded-[1.8rem] bg-[#08131f]/80 p-4 text-slate-300">
                    <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Attempting</span>
                    <span className="text-2xl font-semibold text-white">{attemptingCount}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Level", value: profileLevel, description: "Skill progress" },
                    { label: "Rank", value: profileRank, description: "Position on the platform" },
                    { label: "Score", value: profileScore, description: "Activity score" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.8rem] border border-slate-800 bg-[#111827]/95 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                      <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { label: "Contest Score", value: stats.contestScore, description: "Points earned from contests" },
                    { label: "Total Submissions", value: stats.totalSubmissions, description: "All attempts made" },
                    { label: "Problems Solved", value: stats.problemsSolved, description: "Accepted challenges" },
                    { label: "Total Problems", value: stats.totalProblems, description: "In the database" },
                    { label: "Solved Ratio", value: `${stats.solvedRatio}%`, description: "Coverage of available problems" },
                    { label: "Problems Attempted", value: stats.problemsAttempted, description: "Unique challenges tried" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.8rem] border border-slate-800 bg-[#111827]/95 p-6 min-h-[170px]">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <p className="mt-4 text-4xl font-semibold text-white">{item.value}</p>
                      <p className="mt-3 text-sm text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="rounded-[2rem] border border-[#172438] bg-[#08111d]/95 p-6 shadow-2xl shadow-black/40">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Submission Heatmap</p>
                    <p className="mt-2 text-sm text-slate-500">Daily activity over the last year.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-[#0d172c] p-4 text-center">
                      <p className="text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">Current streak</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stats.currentStreak}</p>
                    </div>
                    <div className="rounded-3xl bg-[#0d172c] p-4 text-center">
                      <p className="text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">Longest streak</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stats.longestStreak}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto pb-3">
                  <div className="grid gap-[0.3rem] text-[0.72rem] uppercase tracking-[0.14em] text-slate-400" style={{ gridTemplateColumns: heatmap.gridTemplateColumns }}>
                    {heatmap.monthLabels.map((segment) => (
                      <div
                        key={`${segment.label}-${segment.weekIndex}`}
                        className="flex items-center"
                        style={{ gridColumn: `${segment.startColumn} / span ${segment.span}` }}
                      >
                        <span className="text-slate-300">{segment.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-[0.3rem]" style={{ gridTemplateColumns: heatmap.gridTemplateColumns }}>
                    {heatmap.layoutColumns.map((column) => (
                      column.type === "gap" ? (
                        <div key={column.key} className="h-24" />
                      ) : (
                        <div key={`week-${column.weekIndex}`} className="grid gap-[0.3rem]">
                          {column.days.map((day) => (
                            <div
                              key={day.date}
                              className={`h-3 w-3 rounded-sm border ${heatLevelClass(day.count)}`}
                              title={day.visible ? `${day.date}: ${day.count} submissions` : ""}
                            />
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-4 text-[0.72rem] text-slate-400">
                  <div className="rounded-[1.5rem] bg-[#07121f]/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Database coverage</p>
                        <p className="mt-2 text-sm text-slate-300">{stats.problemsSolved} of {stats.totalProblems} solved</p>
                      </div>
                      <span className="text-sm font-semibold text-cyan-300">{stats.solvedRatio}%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#0b1630] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${stats.solvedRatio}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm bg-[#0b1422] border border-[#14203b]" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm bg-[#0f5139] border border-[#103c31]" />
                      <span>1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm bg-[#1f8c4d] border border-[#16643b]" />
                      <span>2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm bg-[#31c567] border border-[#1f9247]" />
                      <span>3-4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm bg-[#79ff85] border border-[#22c55e]" />
                      <span>5+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-[#161b22]/95 p-6 shadow-xl shadow-black/20">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Verdict Breakdown</p>
                <div className="mt-6 space-y-3">
                  {Object.entries(stats.verdictCounts).map(([verdict, count]) => (
                    <div key={verdict} className="rounded-[1.5rem] bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-white">{verdict}</p>
                        <p className="text-sm font-semibold text-cyan-300">{count}</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-900">
                        <div
                          className="h-full rounded-full bg-cyan-500"
                          style={{ width: `${Math.min(100, Math.round((count / stats.totalSubmissions) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.8rem] bg-slate-950/80 p-4 text-sm text-slate-400">
                  <p className="font-semibold text-slate-200">Performance tips</p>
                  <ul className="mt-3 space-y-2">
                    <li>Keep daily submissions consistent to grow your streak.</li>
                    <li>Review failed results to improve the accepted rate.</li>
                    <li>Mix easy and medium problems for steady progress.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
