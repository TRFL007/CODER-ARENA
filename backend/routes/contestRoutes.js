import express from "express";
import Contest from "../models/Contest.js";

const router = express.Router();

/*
=================================
CREATE CONTEST
=================================
*/
router.post("/create", async (req, res) => {
  try {
    const contest = await Contest.create(req.body);
    res.json(contest);
  } catch (err) {
    console.error("CREATE CONTEST ERROR:", err);
    res.status(500).json({ message: "Contest creation failed", error: err.message });
  }
});

/*
=================================
GET ALL CONTESTS
=================================
*/
router.get("/", async (req, res) => {
  try {
    const contests = await Contest.find().populate("problems");
    res.json(contests);
  } catch (err) {
    console.error("FETCH CONTESTS ERROR:", err);
    res.status(500).json({ message: "Error fetching contests" });
  }
});

/*
=================================
GET SINGLE CONTEST
=================================
*/
router.get("/:id", async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate("problems");

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.json(contest);
  } catch (err) {
    console.error("FETCH CONTEST ERROR:", err);
    res.status(500).json({ message: "Error loading contest" });
  }
});

export default router;
