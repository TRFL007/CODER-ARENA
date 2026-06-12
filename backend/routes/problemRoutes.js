import express from "express";
import Problem from "../models/Problem.js";
import interviewQuestions from "../data/seedInterviewQuestions.js";

const router = express.Router();

/*
=================================
CREATE PROBLEM
=================================
*/
router.post("/create", async (req, res) => {
  try {
    const points = Problem.getScoreForDifficulty(req.body.difficulty);
    const problem = await Problem.create({ ...req.body, points });
    res.json(problem);
  } catch (err) {
    console.error("CREATE PROBLEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET INTERVIEW QUESTIONS (TOP 150)
=================================
*/
router.get("/interview", async (req, res) => {
  try {
    const problems = await Problem.find({ isInterviewQuestion: true })
      .sort({ createdAt: -1 })
      .select("-testCases");
    res.json(problems);
  } catch (err) {
    console.error("FETCH INTERVIEW QUESTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET ALL PROBLEMS
=================================
*/
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find()
      .sort({ createdAt: -1 })
      .select("title difficulty points");
    res.json(problems);
  } catch (err) {
    console.error("FETCH PROBLEMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET SINGLE PROBLEM
=================================
*/
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    console.error("FETCH PROBLEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
UPDATE PROBLEM
=================================
*/
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    let difficulty = req.body.difficulty;

    if (!difficulty) {
      const existingProblem = await Problem.findById(req.params.id).select("difficulty");
      if (existingProblem) {
        difficulty = existingProblem.difficulty;
      }
    }

    if (difficulty) {
      updateData.points = Problem.getScoreForDifficulty(difficulty);
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    console.error("UPDATE PROBLEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
DELETE PROBLEM
=================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json({ message: "Problem deleted", id: req.params.id });
  } catch (err) {
    console.error("DELETE PROBLEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
SEED 150 INTERVIEW QUESTIONS
=================================
*/
router.post("/seed", async (req, res) => {
  try {
    const existingTitles = (await Problem.find().select("title")).map(p => p.title);
    const newQuestions = interviewQuestions
      .filter((q) => !existingTitles.includes(q.title))
      .map((q) => ({
        ...q,
        points: Problem.getScoreForDifficulty(q.difficulty)
      }));

    if (newQuestions.length === 0) {
      return res.json({ message: "All 150 questions already exist", inserted: 0 });
    }

    const result = await Problem.insertMany(newQuestions);
    res.json({ message: `Seeded ${result.length} new questions`, inserted: result.length });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

