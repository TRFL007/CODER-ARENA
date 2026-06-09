import express from "express";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import ContestScore from "../models/ContestScore.js";
import Problem from "../models/Problem.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const buildDateKey = (date) => {
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
};

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const submissions = await Submission.find({ userId }).lean();
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter((item) => item.verdict === "Accepted").length;
    const problemsAttempted = new Set(submissions.map((item) => String(item.problemId))).size;
    const problemsSolved = new Set(
      submissions
        .filter((item) => item.verdict === "Accepted")
        .map((item) => String(item.problemId))
    ).size;

    const verdictCounts = submissions.reduce((counts, item) => {
      const verdict = item.verdict || "Other";
      counts[verdict] = (counts[verdict] || 0) + 1;
      return counts;
    }, {});

    const contestScores = await ContestScore.aggregate([
      {
        $group: {
          _id: {
            username: { $toLower: "$username" }
          },
          totalContestScore: { $sum: "$score" },
          contestCount: { $sum: 1 }
        }
      }
    ]);

    const contestScoreMap = contestScores.reduce((map, item) => {
      map[item._id.username] = {
        totalContestScore: item.totalContestScore,
        contestCount: item.contestCount
      };
      return map;
    }, {});

    const usernameKey = (user.name || user.email || "").toLowerCase();
    const userContestData = contestScoreMap[usernameKey] || {
      totalContestScore: 0,
      contestCount: 0
    };

    const totalProblems = await Problem.countDocuments();
    const solvedRatio = totalProblems ? Math.round((problemsSolved / totalProblems) * 100) : 0;

    const difficultyTotals = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    const difficultyMap = difficultyTotals.reduce(
      (map, item) => ({
        ...map,
        [item._id]: item.count
      }),
      { Easy: 0, Medium: 0, Hard: 0 }
    );

    const solvedDifficultyCounts = await Submission.aggregate([
      { $match: { userId, verdict: "Accepted" } },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problem"
        }
      },
      { $unwind: "$problem" },
      {
        $group: {
          _id: "$problem.difficulty",
          solvedProblems: { $addToSet: "$problem._id" }
        }
      },
      {
        $project: {
          difficulty: "$_id",
          solvedCount: { $size: "$solvedProblems" }
        }
      }
    ]);

    const solvedDifficultyMap = solvedDifficultyCounts.reduce(
      (map, item) => ({
        ...map,
        [item.difficulty]: item.solvedCount
      }),
      { Easy: 0, Medium: 0, Hard: 0 }
    );

    const attemptingCount = Math.max(0, problemsAttempted - problemsSolved);

    const difficultySummary = ["Easy", "Medium", "Hard"].map((difficulty) => ({
      difficulty,
      solved: solvedDifficultyMap[difficulty] || 0,
      total: difficultyMap[difficulty] || 0
    }));

    const problemsScoreValue = problemsSolved * 20;
    const profilePoints = problemsScoreValue + userContestData.totalContestScore;

    const submissionStats = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          solvedCount: {
            $sum: {
              $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const submissionMap = submissionStats.reduce((map, item) => {
      map[item._id.toString()] = item.solvedCount;
      return map;
    }, {});

    const allUsers = await User.find().lean();
    const userRankScores = allUsers.map((otherUser) => {
      const otherName = (otherUser.name || otherUser.email || "").toLowerCase();
      const otherContest = contestScoreMap[otherName] || { totalContestScore: 0 };
      const otherSolved = submissionMap[otherUser._id.toString()] || 0;
      return otherSolved * 20 + otherContest.totalContestScore;
    });

    const globalRank =
      1 + userRankScores.filter((score) => score > profilePoints).length;

    const dailyCounts = submissions.reduce((counts, item) => {
      const dayKey = buildDateKey(item.createdAt);
      counts[dayKey] = (counts[dayKey] || 0) + 1;
      return counts;
    }, {});

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (29 - index));
      const dateKey = buildDateKey(day);
      return {
        date: dateKey,
        count: dailyCounts[dateKey] || 0
      };
    });

    const last365Days = Array.from({ length: 365 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (364 - index));
      const dateKey = buildDateKey(day);
      return {
        date: dateKey,
        count: dailyCounts[dateKey] || 0
      };
    });

    let currentStreak = 0;
    for (let i = last30Days.length - 1; i >= 0; i -= 1) {
      if (last30Days[i].count > 0) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let runningStreak = 0;
    last30Days.forEach((day) => {
      if (day.count > 0) {
        runningStreak += 1;
        longestStreak = Math.max(longestStreak, runningStreak);
      } else {
        runningStreak = 0;
      }
    });

    const stats = {
      totalSubmissions,
      acceptedSubmissions,
      acceptedRate: totalSubmissions
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
        : 0,
      problemsAttempted,
      problemsSolved,
      activeDays: Object.keys(dailyCounts).length,
      currentStreak,
      longestStreak,
      verdictCounts,
      last30Days,
      last365Days,
      contestScore: userContestData.totalContestScore,
      contestsParticipated: userContestData.contestCount,
      profilePoints,
      globalRank,
      profileLevel: `Tier ${Math.min(12, Math.max(1, Math.ceil(profilePoints / 50)))}`,
      totalProblems,
      solvedRatio
    };

    return res.json({ user: { name: user.name, email: user.email, joinedAt: user.createdAt }, stats });
  } catch (err) {
    console.error("USER STATS ERROR:", err);
    return res.status(500).json({ error: "Unable to load profile stats" });
  }
});

export default router;
