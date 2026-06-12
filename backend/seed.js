import mongoose from "mongoose";
import Problem from "./models/Problem.js";
import interviewQuestions from "./data/seedInterviewQuestions.js";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/coder-arena";

const sampleProblems = [
  // Easy Problems
  {
    title: "Two Sum",
    difficulty: "Easy",
    statement: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" }
    ]
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    statement: "Write a function that reverses a string. The input string is given as an array of characters.",
    sampleInput: "s = ['h','e','l','l','o']",
    sampleOutput: "['o','l','l','e','h']",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "abc", expectedOutput: "cba" }
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    sampleInput: "s = \"()\"",
    sampleOutput: "true",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" }
    ]
  },
  {
    title: "Palindrome Number",
    difficulty: "Easy",
    statement: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    sampleInput: "x = 121",
    sampleOutput: "true",
    testCases: [
      { input: "121", expectedOutput: "true" },
      { input: "-121", expectedOutput: "false" },
      { input: "10", expectedOutput: "false" }
    ]
  },
  {
    title: "Merge Sorted Array",
    difficulty: "Easy",
    statement: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n representing the number of valid elements in each array.",
    sampleInput: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
    sampleOutput: "[1,2,2,3,5,6]",
    testCases: [
      { input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expectedOutput: "[1,2,2,3,5,6]" }
    ]
  },

  // Medium Problems
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    statement: "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
    sampleInput: "l1 = [2,4,3], l2 = [5,6,4]",
    sampleOutput: "[7,0,8]",
    testCases: [
      { input: "[2,4,3]\n[5,6,4]", expectedOutput: "[7,0,8]" },
      { input: "[0]\n[0]", expectedOutput: "[0]" }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    sampleInput: "s = \"abcabcbb\"",
    sampleOutput: "3",
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" }
    ]
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    statement: "You are given an integer array height of length n. There are n vertical lines drawn at height[i].",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]",
    sampleOutput: "49",
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { input: "[1,1]", expectedOutput: "1" }
    ]
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    statement: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    sampleInput: "head = [1,2,3,4,5], n = 2",
    sampleOutput: "[1,2,3,5]",
    testCases: [
      { input: "[1,2,3,4,5]\n2", expectedOutput: "[1,2,3,5]" }
    ]
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    statement: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    sampleInput: "n = 3",
    sampleOutput: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
    testCases: [
      { input: "3", expectedOutput: "5 combinations" },
      { input: "1", expectedOutput: "1 combination" }
    ]
  },

  // Hard Problems
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    statement: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    sampleInput: "nums1 = [1,3], nums2 = [2]",
    sampleOutput: "2.0",
    testCases: [
      { input: "[1,3]\n[2]", expectedOutput: "2.0" },
      { input: "[1,2]\n[3,4]", expectedOutput: "2.5" }
    ]
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    statement: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
    sampleInput: "s = \"aa\", p = \"a\"",
    sampleOutput: "false",
    testCases: [
      { input: "aa\na", expectedOutput: "false" },
      { input: "aa\na*", expectedOutput: "true" }
    ]
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    statement: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,1,3,4,4,5,6]",
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,1,3,4,4,5,6]" }
    ]
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { input: "[4,2,0,3,2,5]", expectedOutput: "9" }
    ]
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    statement: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",
    sampleInput: "n = 4",
    sampleOutput: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]",
    testCases: [
      { input: "4", expectedOutput: "2 solutions" },
      { input: "1", expectedOutput: "1 solution" }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");

    // Insert sample problems
    const result = await Problem.insertMany(sampleProblems);
    console.log(`✅ Inserted ${result.length} sample problems`);

    // Mark interview questions and insert them
    const interviewQsWithFlag = interviewQuestions.map((q) => ({
      ...q,
      isInterviewQuestion: true
    }));

    const interviewResult = await Problem.insertMany(interviewQsWithFlag);
    console.log(`✅ Inserted ${interviewResult.length} interview questions`);

    // Count problems by difficulty
    const counts = await Promise.all([
      Problem.countDocuments({ difficulty: "Easy" }),
      Problem.countDocuments({ difficulty: "Medium" }),
      Problem.countDocuments({ difficulty: "Hard" })
    ]);

    const interviewCounts = await Promise.all([
      Problem.countDocuments({ isInterviewQuestion: true, difficulty: "Easy" }),
      Problem.countDocuments({ isInterviewQuestion: true, difficulty: "Medium" }),
      Problem.countDocuments({ isInterviewQuestion: true, difficulty: "Hard" })
    ]);

    console.log(`\n📊 Problem Distribution:`);
    console.log(`   Easy: ${counts[0]} (Interview: ${interviewCounts[0]})`);
    console.log(`   Medium: ${counts[1]} (Interview: ${interviewCounts[1]})`);
    console.log(`   Hard: ${counts[2]} (Interview: ${interviewCounts[2]})`);
    console.log(`   Total: ${counts[0] + counts[1] + counts[2]}`);
    console.log(`\n🎯 Interview Questions: ${interviewResult.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
