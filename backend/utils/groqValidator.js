import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Validates a test case using Groq AI
 * Checks if:
 * 1. Input format makes sense for the problem
 * 2. Expected output is logically correct
 * 3. Test case is not trivial/duplicate
 */
export const validateTestCaseWithGroq = async (problemStatement, testCase) => {
  if (!GROQ_API_KEY) {
    return {
      isValid: true,
      message: "Groq API not configured, test case accepted",
      groqAnalysis: "N/A"
    };
  }

  try {
    const prompt = `You are a code problem test case validator. 
    
Problem Statement:
${problemStatement}

Test Case Submission:
Input: ${testCase.input}
Expected Output: ${testCase.expectedOutput}
Description: ${testCase.description || "No description provided"}

Validate this test case and respond with ONLY valid JSON (no markdown, no backticks):
{
  "isValid": boolean (true if test case is valid and non-trivial),
  "confidence": number (0-1),
  "issues": [list of issues if any],
  "suggestions": "any suggestions to improve the test case",
  "verdict": "one line summary"
}

Consider:
1. Does input format match the problem requirements?
2. Is expected output logically correct based on problem logic?
3. Is this a meaningful, non-trivial test case?
4. Are there any obvious edge cases it's missing?`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Groq");
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    return {
      isValid: analysisResult.isValid && analysisResult.confidence >= 0.6,
      message: analysisResult.verdict,
      groqAnalysis: JSON.stringify(analysisResult),
      issues: analysisResult.issues,
      suggestions: analysisResult.suggestions
    };
  } catch (error) {
    console.error("Groq validation error:", error.message);
    return {
      isValid: false,
      message: "Validation failed: " + error.message,
      groqAnalysis: null
    };
  }
};

/**
 * Check if user's solution works with given test case
 * Used to validate that a test case can actually be solved
 */
export const validateTestCaseExecutable = async (code, language, testCase) => {
  // This would use the existing code execution infrastructure
  // Returns { passed: boolean, output: string, error: string }
  // Implemented in codeRoutes.js
  return null;
};
