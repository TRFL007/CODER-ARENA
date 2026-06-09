import express from "express";
import Discussion from "../models/Discussion.js";

const router = express.Router();

/*
=================================
CREATE DISCUSSION POST
=================================
*/
router.post("/create", async (req, res) => {
  try {
    const { problemId, username, message } = req.body;

    if (!problemId || !message) {
      return res.status(400).json({ error: "problemId and message required" });
    }

    const post = await Discussion.create({ problemId, username, message });

    res.json(post);
  } catch (err) {
    console.error("CREATE DISCUSSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET DISCUSSIONS FOR A PROBLEM
=================================
*/
router.get("/:problemId", async (req, res) => {
  try {
    const posts = await Discussion.find({
      problemId: req.params.problemId
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("FETCH DISCUSSIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
