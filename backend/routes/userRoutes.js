import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import ContestScore from "../models/ContestScore.js";
import Contest from "../models/Contest.js";
import MultiplayerRoom from "../models/MultiplayerRoom.js";
import Problem from "../models/Problem.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const buildDateKey = (date) => {
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
};

const escapeRegExp = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("FETCH USER COUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

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
      { $match: { userId: new mongoose.Types.ObjectId(userId), verdict: "Accepted" } },
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

    const problemsScoreValue = user.totalScore || 0;
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

    const allUsers = await User.find().select("totalScore").lean();
    const userRankScores = allUsers.map((otherUser) => {
      const otherContest = contestScoreMap[(otherUser.name || otherUser.email || "").toLowerCase()] || { totalContestScore: 0 };
      return (otherUser.totalScore || 0) + otherContest.totalContestScore;
    });

    const globalRank =
      1 + userRankScores.filter((score) => score > profilePoints).length;

    const dailyCounts = submissions.reduce((counts, item) => {
      const dayKey = buildDateKey(item.createdAt);
      counts[dayKey] = (counts[dayKey] || 0) + 1;
      return counts;
    }, {});

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const last30Days = Array.from({ length: 30 }, (_, index) => {
      const day = new Date(todayUTC);
      day.setUTCDate(todayUTC.getUTCDate() - (29 - index));
      const dateKey = day.toISOString().slice(0, 10);
      return {
        date: dateKey,
        count: dailyCounts[dateKey] || 0
      };
    });

    const last365Days = Array.from({ length: 365 }, (_, index) => {
      const day = new Date(todayUTC);
      day.setUTCDate(todayUTC.getUTCDate() - (364 - index));
      const dateKey = day.toISOString().slice(0, 10);
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

    const recentSubmissions = await Submission.find({ userId, verdict: "Accepted" })
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("problemId", "title")
      .lean();

    const recentAC = recentSubmissions.map((item) => {
      const diffMs = Date.now() - new Date(item.createdAt).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeStr = "Just now";
      if (diffDays > 0) {
        timeStr = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      } else if (diffHours > 0) {
        timeStr = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffMins > 0) {
        timeStr = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      }

      return {
        id: item._id,
        title: item.problemId?.title || "Unknown Problem",
        problemId: item.problemId?._id || null,
        time: timeStr
      };
    });

    const usernameMatch = (user.name || user.email || "").trim();
    const escapedUsername = escapeRegExp(usernameMatch);

    const contestScoreDocs = await ContestScore.find({
      username: { $regex: `^${escapedUsername}$`, $options: "i" }
    })
      .sort({ createdAt: -1 })
      .lean();

    const contestIds = [...new Set(contestScoreDocs.map((doc) => String(doc.contestId)))];
    const validContestIds = contestIds.filter((id) => mongoose.isValidObjectId(id));
    const contests = validContestIds.length
      ? await Contest.find({ _id: { $in: validContestIds } })
          .select("title startTime endTime")
          .lean()
      : [];

    const contestMap = contests.reduce((map, contest) => {
      map[String(contest._id)] = contest;
      return map;
    }, {});

    const contestHistory = await Promise.all(
      contestScoreDocs.map(async (doc) => {
        const contest = contestMap[String(doc.contestId)] || {};
        const rank =
          (await ContestScore.countDocuments({
            contestId: doc.contestId,
            score: { $gt: doc.score }
          })) + 1;
        const totalParticipants = await ContestScore.countDocuments({
          contestId: doc.contestId
        });

        return {
          contestId: String(doc.contestId),
          title: contest.title || "Unknown Contest",
          score: doc.score,
          penalty: doc.penalty || 0,
          rank,
          totalParticipants,
          date: contest.startTime || doc.createdAt,
          status:
            contest.endTime && new Date() > new Date(contest.endTime)
              ? "Ended"
              : "Active"
        };
      })
    );

    const battleRooms = await MultiplayerRoom.find({
      players: { $in: [new RegExp(`^${escapedUsername}$`, "i")] },
      status: "finished"
    })
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

    const battleHistory = battleRooms.map((room) => {
      const normalizedUsername = usernameMatch.toLowerCase();
      const opponent =
        room.players.find((player) => player.toLowerCase() !== normalizedUsername) ||
        room.players[0] ||
        "Opponent";
      const result = room.winner
        ? room.winner.toLowerCase() === normalizedUsername
          ? "Won"
          : "Lost"
        : "Finished";

      return {
        roomId: String(room._id),
        opponent,
        result,
        winner: room.winner || "TBD",
        problems: room.selectedProblems?.length || 0,
        date: room.updatedAt || room.createdAt,
        duration: room.battleTime || 0,
        status: room.status
      };
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
      profileLevel: `Tier ${Math.min(12, Math.max(1, Math.ceil(profilePoints / 10)))}`,
      totalProblems,
      solvedRatio,
      difficultySummary,
      recentAC,
      contestHistory,
      battleHistory
    };

    return res.json({ user: { name: user.name, email: user.email, joinedAt: user.createdAt }, stats });
  } catch (err) {
    console.error("USER STATS ERROR:", err);
    return res.status(500).json({ error: "Unable to load profile stats" });
  }
});

export default router;
