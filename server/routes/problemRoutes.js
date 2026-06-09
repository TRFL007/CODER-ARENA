import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

/*
=================================
CREATE PROBLEM
=================================
*/
router.post("/create", async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.json(problem);
  } catch (err) {
    console.error("CREATE PROBLEM ERROR:", err);
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
    const problems = await Problem.find().select(
      "title difficulty points"
    );
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

export default router;
