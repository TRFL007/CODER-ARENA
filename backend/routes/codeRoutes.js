import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
=============================================
LANGUAGE CONFIG
Maps language -> Docker image, file ext,
compile command, run command
=============================================
*/
const LANGUAGE_CONFIG = {
  cpp: {
    image: "gcc:latest",
    ext: "main.cpp",
    compileCmd: "g++ /app/main.cpp -o /app/main -std=c++17",
    runCmd: "cat /app/input.txt | /app/main"
  },
  c: {
    image: "gcc:latest",
    ext: "main.c",
    compileCmd: "gcc /app/main.c -o /app/main",
    runCmd: "cat /app/input.txt | /app/main"
  },
  java: {
    image: "eclipse-temurin:17-jdk-jammy",
    ext: "Main.java",
    compileCmd: "javac /app/Main.java",
    runCmd: "cat /app/input.txt | java -cp /app Main"
  },
  python: {
    image: "python:3.11-slim",
    ext: "main.py",
    compileCmd: null,
    runCmd: "cat /app/input.txt | python3 /app/main.py"
  },
  javascript: {
    image: "node:18-slim",
    ext: "main.js",
    compileCmd: null,
    runCmd: "cat /app/input.txt | node /app/main.js"
  }
};

const getTempDir = () =>
  path.join(__dirname, "..", "temp");

const cleanDir = (folder) => {
  try {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
    }
  } catch (e) {
    console.warn("Cleanup warning:", e.message);
  }
};

/*
=============================================
RUN CODE IN DOCKER
=============================================
*/
const runInDocker = (folder, lang, input = "") => {
  return new Promise((resolve, reject) => {
    const config = LANGUAGE_CONFIG[lang];
    if (!config) {
      return reject(new Error(`Unsupported language: ${lang}`));
    }

    /*
    Write input file (even if empty, so the run command works)
    */
    fs.writeFileSync(path.join(folder, "input.txt"), input || "");

    /*
    Normalize path for Docker on Windows
    */
    const dockerPath = folder.replace(/\\/g, "/");

    let command;
    if (config.compileCmd) {
      command = `docker run --rm --memory=128m --cpus=0.5 -v "${dockerPath}:/app" ${config.image} bash -c "${config.compileCmd} && ${config.runCmd}"`;
    } else {
      command = `docker run --rm --memory=128m --cpus=0.5 -v "${dockerPath}:/app" ${config.image} bash -c "${config.runCmd}"`;
    }

    exec(
      command,
      { timeout: 10000 },
      (error, stdout, stderr) => {
        cleanDir(folder);

        if (error) {
          /*
          Distinguish TLE vs compile/runtime error
          */
          if (error.killed || error.signal === "SIGTERM") {
            return reject(new Error("Time Limit Exceeded"));
          }
          return reject(new Error(stderr || error.message));
        }

        resolve(String(stdout).trim());
      }
    );
  });
};

/*
=============================================
COMPILE ENDPOINT (syntax check only)
=============================================
*/
router.post("/compile", async (req, res) => {
  try {
    const { code, language = "cpp" } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: "No code provided" });
    }

    const config = LANGUAGE_CONFIG[language];
    if (!config) {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    const id = uuidv4();
    const folder = path.join(getTempDir(), id);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, config.ext), code);
    fs.writeFileSync(path.join(folder, "input.txt"), "");

    /*
    For interpreted languages, just do a syntax check / dry run
    */
    const dockerPath = folder.replace(/\\/g, "/");

    let command;
    if (language === "python") {
      command = `docker run --rm --memory=64m -v "${dockerPath}:/app" ${config.image} bash -c "python3 -m py_compile /app/main.py && echo OK"`;
    } else if (language === "javascript") {
      command = `docker run --rm --memory=64m -v "${dockerPath}:/app" ${config.image} bash -c "node --check /app/main.js && echo OK"`;
    } else if (config.compileCmd) {
      command = `docker run --rm --memory=64m -v "${dockerPath}:/app" ${config.image} bash -c "${config.compileCmd}"`;
    } else {
      command = `docker run --rm --memory=64m -v "${dockerPath}:/app" ${config.image} bash -c "echo OK"`;
    }

    exec(
      command,
      { timeout: 15000 },
      (error, stdout, stderr) => {
        cleanDir(folder);

        if (error) {
          return res.json({
            success: false,
            error: stderr || error.message
          });
        }

        return res.json({
          success: true,
          message: "✅ Compilation Successful"
        });
      }
    );
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/*
=============================================
SUBMIT ENDPOINT
Runs all test cases and returns verdict
=============================================
*/
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { problemId, code, language = "cpp" } = req.body;

    if (!problemId) {
      return res.status(400).json({ error: "problemId required" });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const config = LANGUAGE_CONFIG[language];
    if (!config) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ error: "No test cases found for this problem" });
    }

    let passed = 0;
    const results = [];

    for (const testCase of problem.testCases) {
      const id = uuidv4();
      const folder = path.join(getTempDir(), id);
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, config.ext), code);

      /*
      BUG FIX: Problem schema uses `expectedOutput` not `output`
      Support both field names for backwards compatibility
      */
      const expectedRaw =
        testCase.expectedOutput ?? testCase.output ?? "";

      const expected = String(expectedRaw).trim();
      const inputRaw = testCase.input ?? "";

      let output = "";
      let status = "Wrong Answer";

      try {
        output = await runInDocker(folder, language, inputRaw);

        if (output === expected) {
          passed++;
          status = "Accepted";
        }
      } catch (runErr) {
        status = runErr.message.includes("Time Limit")
          ? "Time Limit Exceeded"
          : "Runtime Error";
        output = runErr.message;
      }

      results.push({
        input: inputRaw,
        expected,
        output,
        status
      });
    }

    const total = problem.testCases.length;
    const verdict = passed === total ? "Accepted" : "Wrong Answer";
    const pointsEarned = verdict === "Accepted" ? Problem.getScoreForDifficulty(problem.difficulty) : 0;

    const submission = await Submission.create({
      userId: req.user.userId,
      problemId,
      verdict,
      language,
      points: pointsEarned
    });

    // Update user score if accepted
    if (pointsEarned > 0) {
      // Check if user has already solved this problem
      const previousSubmission = await Submission.findOne({
        userId: req.user.userId,
        problemId,
        verdict: "Accepted",
        _id: { $ne: submission._id }
      });

      // Only add points if this is the first accepted submission
      if (!previousSubmission) {
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            $inc: {
              totalScore: pointsEarned,
              problemsSolved: 1
            }
          }
        );
      }
    }

    return res.json({
      verdict,
      passed,
      total,
      results
    });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    return res.status(500).json({ error: String(err.message || err) });
  }
});

export default router;
