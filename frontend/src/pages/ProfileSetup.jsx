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

  const easyPointValue = 2;
  const mediumPointValue = 3;
  const hardPointValue = 5;

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

    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();
    const endYear = endDate.getUTCFullYear();
    const endMonth = endDate.getUTCMonth();

    const monthList = [];
    let curYear = startYear;
    let curMonth = startMonth;

    while (curYear < endYear || (curYear === endYear && curMonth <= endMonth)) {
      monthList.push({ year: curYear, month: curMonth });
      curMonth += 1;
      if (curMonth > 11) {
        curMonth = 0;
        curYear += 1;
      }
    }

    const weeks = [];
    const monthStarts = [];
    const layoutColumns = [];
    let weekCounter = 0;

    monthList.forEach(({ year, month }, monthIndex) => {
      const label = new Date(Date.UTC(year, month, 1)).toLocaleString("default", { month: "short", timeZone: "UTC" });
      
      monthStarts.push({
        label,
        weekIndex: weekCounter
      });

      const numDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const monthDays = [];
      for (let d = 1; d <= numDays; d += 1) {
        const dayDate = new Date(Date.UTC(year, month, d));
        const dateKey = dayDate.toISOString().slice(0, 10);
        const count = dayMap.get(dateKey) ?? 0;
        monthDays.push({
          date: dateKey,
          count,
          visible: true,
          dayOfWeek: dayDate.getUTCDay()
        });
      }

      const firstDayOfWeek = monthDays[0].dayOfWeek;
      const paddedDays = [];
      
      for (let p = 0; p < firstDayOfWeek; p += 1) {
        const padDate = new Date(Date.UTC(year, month, 1 - (firstDayOfWeek - p)));
        paddedDays.push({
          date: padDate.toISOString().slice(0, 10),
          count: null,
          visible: false,
          dayOfWeek: p
        });
      }
      
      paddedDays.push(...monthDays);
      
      const lastDayOfWeek = monthDays[monthDays.length - 1].dayOfWeek;
      for (let p = lastDayOfWeek + 1; p < 7; p += 1) {
        const padDate = new Date(Date.UTC(year, month, numDays + (p - lastDayOfWeek)));
        paddedDays.push({
          date: padDate.toISOString().slice(0, 10),
          count: null,
          visible: false,
          dayOfWeek: p
        });
      }

      const monthWeeksCount = paddedDays.length / 7;
      
      for (let w = 0; w < monthWeeksCount; w += 1) {
        const daysInWeek = paddedDays.slice(w * 7, (w + 1) * 7);
        weeks.push({
          weekIndex: weekCounter,
          days: daysInWeek
        });
        
        layoutColumns.push({
          type: "week",
          weekIndex: weekCounter,
          days: daysInWeek
        });

        weekCounter += 1;
      }

      if (monthIndex < monthList.length - 1) {
        layoutColumns.push({
          type: "gap",
          key: `gap-${monthIndex}`
        });
      }
    });

    const boundaryWeeks = monthStarts.slice(1).map((segment) => segment.weekIndex);

    const gridTemplateColumns = layoutColumns
      .map((column) => (column.type === "week" ? "0.5rem" : "0.3rem"))
      .join(" ");

    const monthLabels = monthStarts.map((segment, index) => {
      const nextSegment = monthStarts[index + 1];
      const span = Math.max(1, (nextSegment ? nextSegment.weekIndex : weekCounter) - segment.weekIndex);
      const gapCountBefore = index;
      return {
        ...segment,
        span,
        startColumn: segment.weekIndex + 1 + gapCountBefore
      };
    });

    return { weeks, weekCount: weekCounter, monthLabels, boundaryWeeks, layoutColumns, gridTemplateColumns };
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
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header / Account Card */}
        <div className="rounded-xl bg-[#282828] p-6 shadow-md border border-[#3e3e3e]/30">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#00af9b] to-[#006d32] text-2xl font-bold text-white shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name || "Guest User"}</h1>
                <p className="text-sm text-[#8a8a8a]">{user.email || "No email linked"} • Joined {new Date(user.joinedAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center rounded-lg border border-[#3e3e3e] bg-[#3e3e3e]/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3e3e3e]"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-lg bg-red-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-[#282828] p-10 text-center text-[#8a8a8a]">
            Loading profile stats...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-8 text-center text-red-200">
            {error}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            
            {/* Top Row: Solved Stats & Badges */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Solved Stats Card */}
              <div className="rounded-xl bg-[#282828] p-6 shadow-lg border border-[#3e3e3e]/30 flex flex-col sm:flex-row items-center gap-8 justify-between">
                {/* Solved Donut Chart */}
                <div className="relative flex flex-col items-center">
                  <div className="relative flex h-36 w-36 items-center justify-center">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-[#3e3e3e]/50"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      
                      {/* Calculate arc paths */}
                      {(() => {
                        const R = 40;
                        const circumference = 2 * Math.PI * R;
                        let currentOffset = 0;
                        const arcs = [];
                        
                        // Easy arc (blue)
                        if (totalProblems > 0 && easyStats.solved > 0) {
                          const easyRatio = easyStats.solved / totalProblems;
                          arcs.push({
                            name: 'easy',
                            length: circumference * easyRatio,
                            offset: currentOffset,
                            color: '#00af9b'
                          });
                          currentOffset += circumference * easyRatio;
                        }
                        
                        // Medium arc (yellow)
                        if (totalProblems > 0 && mediumStats.solved > 0) {
                          const mediumRatio = mediumStats.solved / totalProblems;
                          arcs.push({
                            name: 'medium',
                            length: circumference * mediumRatio,
                            offset: currentOffset,
                            color: '#ffb800'
                          });
                          currentOffset += circumference * mediumRatio;
                        }
                        
                        // Hard arc (red)
                        if (totalProblems > 0 && hardStats.solved > 0) {
                          const hardRatio = hardStats.solved / totalProblems;
                          arcs.push({
                            name: 'hard',
                            length: circumference * hardRatio,
                            offset: currentOffset,
                            color: '#ff2d55'
                          });
                        }
                        
                        return arcs.map((arc) => (
                          <circle
                            key={arc.name}
                            cx="50"
                            cy="50"
                            r={R}
                            className="fill-transparent"
                            stroke={arc.color}
                            strokeWidth="8"
                            strokeDasharray={`${arc.length} ${circumference}`}
                            strokeDashoffset={-arc.offset}
                            strokeLinecap="round"
                          />
                        ));
                      })()}
                    </svg>
                    
                    <div className="text-center z-10">
                      <p className="text-3xl font-bold text-white">{stats.problemsSolved}</p>
                      <p className="text-[10px] text-[#8a8a8a] border-t border-[#3e3e3e]/60 mt-1 pt-0.5">/{totalProblems}</p>
                      <p className="text-xs text-[#00af9b] font-semibold tracking-wide mt-0.5">Solved</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-[#8a8a8a] font-medium">
                    <span className="text-white font-semibold">{attemptingCount}</span> Attempting
                  </div>
                </div>

                {/* Difficulty Bars */}
                <div className="flex-1 w-full space-y-3">
                  {/* Easy */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3e3e3e]/20">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-[#00af9b]">Easy</span>
                      <span className="text-white">{easyStats.solved}<span className="text-[#8a8a8a] font-normal">/{easyStats.total}</span> · {easyPointValue} pts each</span>
                    </div>
                    <div className="h-[6px] w-full bg-[#3e3e3e]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00af9b] rounded-full"
                        style={{ width: `${easyStats.total ? (easyStats.solved / easyStats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3e3e3e]/20">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-[#ffb800]">Medium</span>
                      <span className="text-white">{mediumStats.solved}<span className="text-[#8a8a8a] font-normal">/{mediumStats.total}</span> · {mediumPointValue} pts each</span>
                    </div>
                    <div className="h-[6px] w-full bg-[#3e3e3e]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ffb800] rounded-full"
                        style={{ width: `${mediumStats.total ? (mediumStats.solved / mediumStats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3e3e3e]/20">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-[#ff2d55]">Hard</span>
                      <span className="text-white">{hardStats.solved}<span className="text-[#8a8a8a] font-normal">/{hardStats.total}</span> · {hardPointValue} pts each</span>
                    </div>
                    <div className="h-[6px] w-full bg-[#3e3e3e]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff2d55] rounded-full"
                        style={{ width: `${hardStats.total ? (hardStats.solved / hardStats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges Card */}
              <div className="rounded-xl bg-[#282828] p-6 shadow-lg border border-[#3e3e3e]/30 flex flex-col justify-between min-h-[220px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">Badges</span>
                  <div className="flex items-center gap-1 text-2xl font-bold text-white cursor-pointer hover:text-[#00af9b] transition">
                    {earnedBadges.length}
                    <svg className="w-5 h-5 text-[#8a8a8a] inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Badges List */}
                <div className="flex gap-4 items-center justify-start overflow-x-auto py-2">
                  {earnedBadges.length > 0 ? (
                    earnedBadges.map((badge) => (
                      <div key={badge.title} className="group relative flex flex-col items-center shrink-0">
                        {/* Hexagon Badge Wrapper */}
                        <div className="relative w-12 h-14 flex items-center justify-center bg-[#3e3e3e]/40 rounded-xl hover:scale-105 transition duration-300">
                          <div className="text-2xl z-10 select-none">
                            {badge.icon}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#eff1f6] mt-1 font-semibold text-center w-14 truncate">{badge.title}</span>
                        
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-16 hidden group-hover:block z-50 bg-[#1a1a1a] text-xs text-white border border-[#3e3e3e] rounded-lg p-2.5 shadow-xl min-w-[160px] text-center transition">
                          <p className="font-bold text-[#eff1f6]">{badge.title}</p>
                          <p className="text-[10px] text-[#8a8a8a] mt-1">{badge.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#8a8a8a] italic py-4">No badges earned yet. Solve problems to unlock badges!</p>
                  )}
                </div>

                {/* Footer Most Recent Badge */}
                {earnedBadges.length > 0 && (
                  <div className="mt-4 border-t border-[#3e3e3e]/40 pt-3 text-xs text-[#8a8a8a]">
                    Most Recent Badge: <span className="text-white font-bold block text-sm mt-1">{earnedBadges[earnedBadges.length - 1].title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Row: Heatmap */}
            <div className="rounded-xl bg-[#282828] p-6 shadow-lg border border-[#3e3e3e]/30 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#3e3e3e]/40 pb-4">
                <div>
                  <h2 className="text-md font-bold text-white flex items-center gap-1.5">
                    {stats.totalSubmissions} submissions <span className="text-xs font-normal text-[#8a8a8a]">in the past one year</span>
                    <svg className="w-4 h-4 text-[#8a8a8a] cursor-pointer hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#8a8a8a]">
                  <span>Total active days: <span className="text-white font-bold">{stats.activeDays}</span></span>
                  <span>Max streak: <span className="text-white font-bold">{stats.longestStreak}</span></span>
                  <div className="relative">
                    <select className="bg-[#3e3e3e] text-white border-none rounded px-3 py-1 cursor-pointer focus:outline-none text-xs font-bold">
                      <option>Current</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="grid gap-[2px] text-[10px] text-[#8a8a8a] mb-2" style={{ gridTemplateColumns: heatmap.gridTemplateColumns }}>
                  {heatmap.monthLabels.map((segment) => (
                    <div
                      key={`${segment.label}-${segment.weekIndex}`}
                      className="flex items-center"
                      style={{ gridColumn: `${segment.startColumn} / span ${segment.span}` }}
                    >
                      <span>{segment.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-[3px]" style={{ gridTemplateColumns: heatmap.gridTemplateColumns }}>
                  {heatmap.layoutColumns.map((column) => (
                    column.type === "gap" ? (
                      <div key={column.key} className="w-[3px]" />
                    ) : (
                      <div key={`week-${column.weekIndex}`} className="grid gap-[3px] grid-rows-7">
                        {column.days.map((day) => (
                          <div
                            key={day.date}
                            className={`h-[10px] w-[10px] rounded-[2px] transition-all duration-300 ${
                              !day.visible
                                ? "bg-transparent"
                                : day.count === 0
                                ? "bg-[#3e3e3e]/30 hover:bg-[#3e3e3e]/60"
                                : day.count === 1
                                ? "bg-[#0e4429] hover:bg-[#0e4429]/80"
                                : day.count === 2
                                ? "bg-[#006d32] hover:bg-[#006d32]/80"
                                : day.count <= 4
                                ? "bg-[#26a641] hover:bg-[#26a641]/80"
                                : "bg-[#39d353] hover:bg-[#39d353]/80"
                            }`}
                            title={day.visible ? `${day.date}: ${day.count} submissions` : ""}
                          />
                        ))}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex justify-between items-center text-[10px] text-[#8a8a8a] mt-2 pt-2 border-t border-[#3e3e3e]/30">
                <div className="flex items-center gap-1.5">
                  <span>Current streak: <span className="text-white font-bold">{stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div className="h-[9px] w-[9px] rounded-[1px] bg-[#3e3e3e]/30" />
                  <div className="h-[9px] w-[9px] rounded-[1px] bg-[#0e4429]" />
                  <div className="h-[9px] w-[9px] rounded-[1px] bg-[#006d32]" />
                  <div className="h-[9px] w-[9px] rounded-[1px] bg-[#26a641]" />
                  <div className="h-[9px] w-[9px] rounded-[1px] bg-[#39d353]" />
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl bg-[#282828] shadow-lg border border-[#3e3e3e]/30 p-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#3e3e3e]/40">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Contest History</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Recent contests</h2>
                  </div>
                  <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs text-blue-200">{stats.contestsParticipated || 0} contests</span>
                </div>

                <div className="mt-5 space-y-3">
                  {stats.contestHistory && stats.contestHistory.length > 0 ? (
                    stats.contestHistory.slice(0, 6).map((contest) => (
                      <div
                        key={contest.contestId}
                        className="rounded-3xl border border-[#3e3e3e]/40 bg-[#1d1d1d] p-4 transition hover:border-blue-400/50"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-400">{new Date(contest.date).toLocaleDateString()}</p>
                            <h3 className="mt-1 text-lg font-semibold text-white">{contest.title}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${contest.status === "Ended" ? "bg-slate-700 text-slate-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                            {contest.status}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
                          <div>
                            <p className="text-[#8a8a8a]">Position</p>
                            <p className="font-semibold text-white">#{contest.rank}</p>
                          </div>
                          <div>
                            <p className="text-[#8a8a8a]">Score</p>
                            <p className="font-semibold text-white">{contest.score}</p>
                          </div>
                          <div>
                            <p className="text-[#8a8a8a]">Players</p>
                            <p className="font-semibold text-white">{contest.totalParticipants}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span>{contest.penalty ? `Penalty ${contest.penalty}` : "No penalty"}</span>
                          <button
                            onClick={() => navigate(`/contest-results/${contest.contestId}`)}
                            className="text-blue-400 hover:text-blue-200"
                          >
                            View results
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-[#3e3e3e]/40 bg-[#1d1d1d] p-6 text-center text-sm text-slate-400">
                      No contest history yet. Join a contest to see your ranking and score here.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-[#282828] shadow-lg border border-[#3e3e3e]/30 p-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#3e3e3e]/40">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Battle History</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Recent battles</h2>
                  </div>
                  <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs text-emerald-200">{stats.battleHistory?.length || 0} matches</span>
                </div>

                <div className="mt-5 space-y-3">
                  {stats.battleHistory && stats.battleHistory.length > 0 ? (
                    stats.battleHistory.slice(0, 6).map((battle) => (
                      <div
                        key={battle.roomId}
                        className="rounded-3xl border border-[#3e3e3e]/40 bg-[#1d1d1d] p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-400">{new Date(battle.date).toLocaleDateString()}</p>
                            <h3 className="mt-1 text-lg font-semibold text-white">vs {battle.opponent}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${battle.result === "Won" ? "bg-green-500/15 text-emerald-300" : battle.result === "Lost" ? "bg-red-500/15 text-rose-300" : "bg-slate-700 text-slate-300"}`}>
                            {battle.result}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
                          <div>
                            <p className="text-[#8a8a8a]">Winner</p>
                            <p className="font-semibold text-white">{battle.winner}</p>
                          </div>
                          <div>
                            <p className="text-[#8a8a8a]">Problems</p>
                            <p className="font-semibold text-white">{battle.problems}</p>
                          </div>
                          <div>
                            <p className="text-[#8a8a8a]">Duration</p>
                            <p className="font-semibold text-white">{battle.duration}s</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-[#3e3e3e]/40 bg-[#1d1d1d] p-6 text-center text-sm text-slate-400">
                      No recent battle results yet. Compete in multiplayer battles to see them here.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : null}
        
      </div>
    </div>
  );
}

