import express from "express";
import ContestScore from "../models/ContestScore.js";

const router = express.Router();

/*
=================================
SAVE / UPSERT SCORE
=================================
*/
router.post("/save", async (req, res) => {
  try {
    const {
      username,
      contestId,
      score,
      problemsSolved,
      submissionCount,
      penalty
    } = req.body;

    if (!username || !contestId) {
      return res.status(400).json({ message: "username and contestId required" });
    }

    const data = await ContestScore.findOneAndUpdate(
      { username, contestId },
      {
        $set: {
          username,
          contestId,
          score: score ?? 0,
          problemsSolved: problemsSolved ?? 0,
          submissionCount: submissionCount ?? 0,
          penalty: penalty ?? 0
        }
      },
      { new: true, upsert: true }
    );

    /*
    BUG FIX: `rankings` was referenced before it was defined.
    Now we fetch fresh rankings after the upsert and emit them.
    */
    const rankings = await ContestScore.find({ contestId })
      .sort({ score: -1, penalty: 1 })
      .lean();

    const io = req.app.get("io");

    /*
    Emit to the contest room so only participants get the update
    */
    io.to(contestId).emit("leaderboardUpdate", rankings);

    res.json({ message: "saved", data });
  } catch (err) {
    console.error("SAVE SCORE ERROR:", err);
    res.status(500).json({ message: "save failed", error: err.message });
  }
});

/*
=================================
GET LEADERBOARD FOR A CONTEST
=================================
*/
router.get("/:contestId", async (req, res) => {
  try {
    const scores = await ContestScore.find({
      contestId: req.params.contestId
    }).sort({ score: -1, penalty: 1 });

    res.json(scores);
  } catch (err) {
    console.error("FETCH LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "fetch failed" });
  }
});

export default router;
