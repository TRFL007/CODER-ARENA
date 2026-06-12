import express from "express";
import Problem from "../models/Problem.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/*
=================================
MARK PROBLEM AS INTERVIEW QUESTION
=================================
*/
router.put("/:id/mark-interview", authMiddleware, async (req, res) => {
  try {
    const { isInterviewQuestion } = req.body;
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { isInterviewQuestion },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    console.error("MARK INTERVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
