import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const ruleBasedAnswer = (question) => {
  const normalized = question.toLowerCase();

  if (normalized.includes("array") || normalized.includes("arrays")) {
    return "When solving array problems, start by identifying whether the solution needs in-place operations or additional memory. Always discuss time complexity and edge cases, then implement a clean two-pointer or hash-based approach depending on the requirement.";
  }

  if (normalized.includes("linked list")) {
    return "For linked list questions, explain how you traverse nodes, manage pointers, and handle boundary cases such as empty lists or single-node lists. Consider whether you need one-pass or two-pass algorithms.";
  }

  if (normalized.includes("time complexity") || normalized.includes("complexity")) {
    return "In interviews, state the time and space complexity clearly and compare alternatives. For example, a sorting-based solution often takes O(n log n), while a single-pass hash-based solution can be O(n) with additional space.";
  }

  if (normalized.includes("binary search")) {
    return "Binary search is ideal whenever the problem involves a sorted array or monotonic condition. Outline the search boundaries, mid-point calculation, and how to adjust left/right pointers to avoid infinite loops.";
  }

  return null;
};

const getInterviewAnswer = async (question) => {
  // Prefer Groq AI if key is configured
  if (GROQ_API_KEY) {
    try {
      const systemPrompt = `You are an interview coach. Answer the user's question about coding, algorithms, system design, or interview strategy. Provide a clear, step-by-step explanation, include complexity analysis when relevant, and give concise example code snippets where helpful. Keep answers focused and actionable.`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "mixtral-8x7b-32768",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
          ],
          temperature: 0.2,
          max_tokens: 800
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 15000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content && typeof content === "string") {
        return content.trim();
      }
    } catch (err) {
      console.error("Groq interview error:", err.message || err);
      // Fall through to rule-based fallback
    }
  }

  // Rule-based fallback
  const rule = ruleBasedAnswer(question);
  if (rule) return rule;

  return "This AI assistant is active. In a real interview, I would help you reason through the problem step-by-step. Ask a question about coding problems, algorithms, system design, or interview preparation.";
};

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    const answer = await getInterviewAnswer(question);
    res.json({ answer });
  } catch (err) {
    console.error("Interview ask error:", err);
    res.status(500).json({ error: "Failed to process interview question" });
  }
});

export default router;
