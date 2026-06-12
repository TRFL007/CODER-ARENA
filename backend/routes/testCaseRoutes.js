import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Problem from "../models/Problem.js";
import TestCaseSubmission from "../models/TestCaseSubmission.js";
import { validateTestCaseWithGroq } from "../utils/groqValidator.js";

const router = express.Router();

/**
 * ===================================================
 * ADMIN ROUTES - Test Case Management
 * ===================================================
 */

/**
 * POST /api/testcases/admin/add-testcase
 * Add official test case to a problem (Admin only)
 * 
 * Body:
 * {
 *   "problemId": "xxx",
 *   "input": "1 2\n3 4",
 *   "expectedOutput": "6",
 *   "description": "Test with two numbers"
 * }
 */
router.post("/admin/add-testcase", verifyToken, async (req, res) => {
  try {
    // In production, verify user is admin
    const { problemId, input, expectedOutput, description } = req.body;

    if (!problemId || !input || !expectedOutput) {
      return res.status(400).json({
        error: "Missing required fields: problemId, input, expectedOutput"
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const newTestCase = {
      input,
      expectedOutput,
      description: description || "",
      isOfficial: true
    };

    problem.testCases.push(newTestCase);
    await problem.save();

    res.json({
      success: true,
      message: "Test case added successfully",
      testCase: newTestCase
    });
  } catch (error) {
    console.error("Add test case error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/testcases/admin/edit-testcase/:problemId/:testCaseId
 * Edit existing official test case (Admin only)
 */
router.put("/admin/edit-testcase/:problemId/:testCaseId", verifyToken, async (req, res) => {
  try {
    const { problemId, testCaseId } = req.params;
    const { input, expectedOutput, description } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const testCase = problem.testCases.id(testCaseId);
    if (!testCase) {
      return res.status(404).json({ error: "Test case not found" });
    }

    if (input) testCase.input = input;
    if (expectedOutput) testCase.expectedOutput = expectedOutput;
    if (description) testCase.description = description;

    await problem.save();

    res.json({
      success: true,
      message: "Test case updated successfully",
      testCase
    });
  } catch (error) {
    console.error("Edit test case error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/testcases/admin/delete-testcase/:problemId/:testCaseId
 * Delete a test case (Admin only)
 */
router.delete(
  "/admin/delete-testcase/:problemId/:testCaseId",
  verifyToken,
  async (req, res) => {
    try {
      const { problemId, testCaseId } = req.params;

      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }

      problem.testCases = problem.testCases.filter(
        (tc) => tc._id.toString() !== testCaseId
      );
      await problem.save();

      res.json({
        success: true,
        message: "Test case deleted successfully"
      });
    } catch (error) {
      console.error("Delete test case error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /api/testcases/admin/submissions
 * Get all pending test case submissions (Admin only)
 */
router.get("/admin/submissions", verifyToken, async (req, res) => {
  try {
    const submissions = await TestCaseSubmission.find({
      status: { $in: ["pending_validation", "validated"] }
    })
      .populate("problemId", "title")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ===================================================
 * USER ROUTES - Test Case Contributions
 * ===================================================
 */

/**
 * POST /api/testcases/user/submit-testcase
 * User submits a test case for validation
 *
 * Body:
 * {
 *   "problemId": "xxx",
 *   "input": "Sample input",
 *   "expectedOutput": "Expected output",
 *   "description": "What this test case tests"
 * }
 */
router.post("/user/submit-testcase", verifyToken, async (req, res) => {
  try {
    const { problemId, input, expectedOutput, description } = req.body;
    const userId = req.user.id;
    const userName = req.user.username || req.user.email;

    // Validation
    if (!problemId || !input || !expectedOutput) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide:\n- Problem ID\n- Input data\n- Expected Output"
      });
    }

    if (input.length > 10000 || expectedOutput.length > 10000) {
      return res.status(400).json({
        error: "Input or output is too large (max 10000 characters each)"
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Validate with Groq AI
    const validationResult = await validateTestCaseWithGroq(problem.statement, {
      input,
      expectedOutput,
      description
    });

    const submission = await TestCaseSubmission.create({
      problemId,
      userId,
      userName,
      input,
      expectedOutput,
      description: description || "",
      status: validationResult.isValid
        ? "validated"
        : "rejected",
      validationResult: {
        isValid: validationResult.isValid,
        message: validationResult.message,
        groqAnalysis: validationResult.groqAnalysis,
        validatedAt: new Date()
      },
      rejectionReason: !validationResult.isValid
        ? validationResult.message
        : null
    });

    res.json({
      success: true,
      message: validationResult.isValid
        ? "✅ Test case validated successfully! Waiting for admin approval."
        : "❌ Test case failed validation. Reason: " +
          validationResult.message,
      submission,
      validationDetails: {
        isValid: validationResult.isValid,
        message: validationResult.message,
        issues: validationResult.issues,
        suggestions: validationResult.suggestions
      }
    });
  } catch (error) {
    console.error("Submit test case error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/testcases/user/my-submissions
 * Get user's own test case submissions
 */
router.get("/user/my-submissions", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await TestCaseSubmission.find({ userId })
      .populate("problemId", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("Fetch my submissions error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ===================================================
 * ADMIN APPROVAL ROUTES
 * ===================================================
 */

/**
 * POST /api/testcases/admin/approve/:submissionId
 * Approve and add a user submission as official test case
 */
router.post("/admin/approve/:submissionId", verifyToken, async (req, res) => {
  try {
    const submission = await TestCaseSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Add to problem's test cases
    const problem = await Problem.findById(submission.problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    problem.testCases.push({
      input: submission.input,
      expectedOutput: submission.expectedOutput,
      description:
        submission.description + ` (Contributed by ${submission.userName})`,
      isOfficial: true
    });

    await problem.save();

    // Update submission status
    submission.status = "validated";
    submission.approvedAt = new Date();
    submission.approvedBy = req.user.id;
    await submission.save();

    res.json({
      success: true,
      message: "Test case approved and added to problem"
    });
  } catch (error) {
    console.error("Approve test case error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/testcases/admin/reject/:submissionId
 * Reject a user test case submission
 */
router.post("/admin/reject/:submissionId", verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: "Please provide a reason for rejection"
      });
    }

    const submission = await TestCaseSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    submission.status = "rejected";
    submission.rejectionReason = reason;
    await submission.save();

    res.json({
      success: true,
      message: "Test case rejected"
    });
  } catch (error) {
    console.error("Reject test case error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/testcases/problem/:problemId
 * Get all official test cases for a problem
 */
router.get("/problem/:problemId", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId).select(
      "testCases"
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Return only official test cases (exclude by IDs if needed)
    const testCases = problem.testCases.filter((tc) => tc.isOfficial);

    res.json(testCases);
  } catch (error) {
    console.error("Fetch test cases error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
