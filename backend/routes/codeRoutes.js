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
DOCKER AUTO-DETECTION
=============================================
*/
let isDockerAvailable = false;

exec("docker ps", (err) => {
  if (!err) {
    isDockerAvailable = true;
    console.log("🐳 Docker detected. Running submissions inside Docker containers.");
  } else {
    console.log("🖥️ Docker not detected. Falling back to direct compilation and execution.");
  }
});

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
RUN CODE DIRECTLY (Fallback when Docker is not available)
=============================================
*/
const runDirectly = (folder, lang, input = "") => {
  return new Promise((resolve, reject) => {
    const config = LANGUAGE_CONFIG[lang];
    if (!config) {
      return reject(new Error(`Unsupported language: ${lang}`));
    }

    fs.writeFileSync(path.join(folder, "input.txt"), input || "");
    const isWindows = process.platform === "win32";
    const inputPath = path.join(folder, "input.txt");

    let compileCmd = null;
    let runCmd = "";

    if (lang === "cpp") {
      const srcPath = path.join(folder, "main.cpp");
      const outPath = path.join(folder, isWindows ? "main.exe" : "main");
      compileCmd = `g++ -std=c++17 "${srcPath}" -o "${outPath}"`;
      runCmd = isWindows
        ? `powershell -Command "Get-Content '${inputPath}' | & '${outPath}'"`
        : `"${outPath}" < "${inputPath}"`;
    } else if (lang === "c") {
      const srcPath = path.join(folder, "main.c");
      const outPath = path.join(folder, isWindows ? "main.exe" : "main");
      compileCmd = `gcc "${srcPath}" -o "${outPath}"`;
      runCmd = isWindows
        ? `powershell -Command "Get-Content '${inputPath}' | & '${outPath}'"`
        : `"${outPath}" < "${inputPath}"`;
    } else if (lang === "java") {
      const srcPath = path.join(folder, "Main.java");
      compileCmd = `javac "${srcPath}"`;
      runCmd = isWindows
        ? `powershell -Command "Get-Content '${inputPath}' | java -cp '${folder}' Main"`
        : `java -cp "${folder}" Main < "${inputPath}"`;
    } else if (lang === "python") {
      const srcPath = path.join(folder, "main.py");
      const pythonBin = isWindows ? "python" : "python3";
      runCmd = isWindows
        ? `powershell -Command "Get-Content '${inputPath}' | ${pythonBin} '${srcPath}'"`
        : `${pythonBin} "${srcPath}" < "${inputPath}"`;
    } else if (lang === "javascript") {
      const srcPath = path.join(folder, "main.js");
      runCmd = isWindows
        ? `powershell -Command "Get-Content '${inputPath}' | node '${srcPath}'"`
        : `node "${srcPath}" < "${inputPath}"`;
    }

    const command = compileCmd ? `${compileCmd} && ${runCmd}` : runCmd;

    exec(
      command,
      { timeout: 10000 },
      (error, stdout, stderr) => {
        cleanDir(folder);

        if (error) {
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
COMPILE CODE DIRECTLY (Fallback syntax check)
=============================================
*/
const compileDirectly = (folder, lang) => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    let command = "";

    if (lang === "cpp") {
      const srcPath = path.join(folder, "main.cpp");
      const outPath = path.join(folder, isWindows ? "main.exe" : "main");
      command = `g++ -std=c++17 "${srcPath}" -o "${outPath}"`;
    } else if (lang === "c") {
      const srcPath = path.join(folder, "main.c");
      const outPath = path.join(folder, isWindows ? "main.exe" : "main");
      command = `gcc "${srcPath}" -o "${outPath}"`;
    } else if (lang === "java") {
      const srcPath = path.join(folder, "Main.java");
      command = `javac "${srcPath}"`;
    } else if (lang === "python") {
      const srcPath = path.join(folder, "main.py");
      const pythonBin = isWindows ? "python" : "python3";
      command = `${pythonBin} -m py_compile "${srcPath}"`;
    } else if (lang === "javascript") {
      const srcPath = path.join(folder, "main.js");
      command = `node --check "${srcPath}"`;
    } else {
      return reject(new Error(`Unsupported language: ${lang}`));
    }

    exec(
      command,
      { timeout: 15000 },
      (error, stdout, stderr) => {
        cleanDir(folder);

        if (error) {
          return reject(new Error(stderr || error.message));
        }

        resolve("✅ Compilation Successful");
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

    if (isDockerAvailable) {
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
    } else {
      try {
        const msg = await compileDirectly(folder, language);
        return res.json({
          success: true,
          message: msg
        });
      } catch (err) {
        return res.json({
          success: false,
          error: err.message
        });
      }
    }
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
        if (isDockerAvailable) {
          output = await runInDocker(folder, language, inputRaw);
        } else {
          output = await runDirectly(folder, language, inputRaw);
        }

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
