// ============================================================
// LeetCode Top Interview 150 — Seed Data
// ============================================================

const interviewQuestions = [

  // ─────────────────── ARRAY / STRING (23) ───────────────────
  {
    title: "Merge Sorted Array",
    difficulty: "Easy",
    statement: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array. The final sorted array should be stored inside nums1.",
    sampleInput: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
    sampleOutput: "[1,2,2,3,5,6]",
    testCases: [
      { input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expectedOutput: "[1,2,2,3,5,6]" },
      { input: "[1]\n1\n[]\n0", expectedOutput: "[1]" },
      { input: "[0]\n0\n[1]\n1", expectedOutput: "[1]" }
    ],
    points: 100
  },
  {
    title: "Remove Element",
    difficulty: "Easy",
    statement: "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Return the number of elements in nums which are not equal to val.",
    sampleInput: "nums = [3,2,2,3], val = 3",
    sampleOutput: "2",
    testCases: [
      { input: "[3,2,2,3]\n3", expectedOutput: "2" },
      { input: "[0,1,2,2,3,0,4,2]\n2", expectedOutput: "5" }
    ],
    points: 100
  },
  {
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    statement: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    sampleInput: "nums = [1,1,2]",
    sampleOutput: "2",
    testCases: [
      { input: "[1,1,2]", expectedOutput: "2" },
      { input: "[0,0,1,1,1,2,2,3,3,4]", expectedOutput: "5" }
    ],
    points: 100
  },
  {
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    statement: "Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. Return the number of elements after modification.",
    sampleInput: "nums = [1,1,1,2,2,3]",
    sampleOutput: "5",
    testCases: [
      { input: "[1,1,1,2,2,3]", expectedOutput: "5" },
      { input: "[0,0,1,1,1,1,2,3,3]", expectedOutput: "7" }
    ],
    points: 150
  },
  {
    title: "Majority Element",
    difficulty: "Easy",
    statement: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
    sampleInput: "nums = [3,2,3]",
    sampleOutput: "3",
    testCases: [
      { input: "[3,2,3]", expectedOutput: "3" },
      { input: "[2,2,1,1,1,2,2]", expectedOutput: "2" }
    ],
    points: 100
  },
  {
    title: "Rotate Array",
    difficulty: "Medium",
    statement: "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
    sampleInput: "nums = [1,2,3,4,5,6,7], k = 3",
    sampleOutput: "[5,6,7,1,2,3,4]",
    testCases: [
      { input: "[1,2,3,4,5,6,7]\n3", expectedOutput: "[5,6,7,1,2,3,4]" },
      { input: "[-1,-100,3,99]\n2", expectedOutput: "[3,99,-1,-100]" }
    ],
    points: 150
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    statement: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    sampleInput: "prices = [7,1,5,3,6,4]",
    sampleOutput: "5",
    testCases: [
      { input: "[7,1,5,3,6,4]", expectedOutput: "5" },
      { input: "[7,6,4,3,1]", expectedOutput: "0" }
    ],
    points: 100
  },
  {
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    statement: "You are given an integer array prices where prices[i] is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. Find and return the maximum profit you can achieve.",
    sampleInput: "prices = [7,1,5,3,6,4]",
    sampleOutput: "7",
    testCases: [
      { input: "[7,1,5,3,6,4]", expectedOutput: "7" },
      { input: "[1,2,3,4,5]", expectedOutput: "4" },
      { input: "[7,6,4,3,1]", expectedOutput: "0" }
    ],
    points: 150
  },
  {
    title: "Jump Game",
    difficulty: "Medium",
    statement: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    sampleInput: "nums = [2,3,1,1,4]",
    sampleOutput: "true",
    testCases: [
      { input: "[2,3,1,1,4]", expectedOutput: "true" },
      { input: "[3,2,1,0,4]", expectedOutput: "false" }
    ],
    points: 150
  },
  {
    title: "Jump Game II",
    difficulty: "Medium",
    statement: "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1].",
    sampleInput: "nums = [2,3,1,1,4]",
    sampleOutput: "2",
    testCases: [
      { input: "[2,3,1,1,4]", expectedOutput: "2" },
      { input: "[2,3,0,1,4]", expectedOutput: "2" }
    ],
    points: 150
  },
  {
    title: "H-Index",
    difficulty: "Medium",
    statement: "Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper, return the researcher's h-index. The h-index is defined as the maximum value of h such that the given researcher has published at least h papers that have each been cited at least h times.",
    sampleInput: "citations = [3,0,6,1,5]",
    sampleOutput: "3",
    testCases: [
      { input: "[3,0,6,1,5]", expectedOutput: "3" },
      { input: "[1,3,1]", expectedOutput: "1" }
    ],
    points: 150
  },
  {
    title: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    statement: "Implement the RandomizedSet class: RandomizedSet() Initializes the object. bool insert(int val) Inserts an item val if not present. Returns true if not present, false otherwise. bool remove(int val) Removes an item val if present. Returns true if present, false otherwise. int getRandom() Returns a random element from the current set of elements. Each element must have the same probability of being returned.",
    sampleInput: "insert(1), remove(2), insert(2), getRandom(), remove(1), insert(2), getRandom()",
    sampleOutput: "true, false, true, 1 or 2, true, false, 2",
    testCases: [
      { input: "insert(1)\ninsert(2)\ngetRandom()", expectedOutput: "true\ntrue\n1 or 2" }
    ],
    points: 150
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    statement: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    sampleInput: "nums = [1,2,3,4]",
    sampleOutput: "[24,12,8,6]",
    testCases: [
      { input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" }
    ],
    points: 150
  },
  {
    title: "Gas Station",
    difficulty: "Medium",
    statement: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    sampleInput: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
    sampleOutput: "3",
    testCases: [
      { input: "[1,2,3,4,5]\n[3,4,5,1,2]", expectedOutput: "3" },
      { input: "[2,3,4]\n[3,4,3]", expectedOutput: "-1" }
    ],
    points: 150
  },
  {
    title: "Candy",
    difficulty: "Hard",
    statement: "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children: each child must have at least one candy, and children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need.",
    sampleInput: "ratings = [1,0,2]",
    sampleOutput: "5",
    testCases: [
      { input: "[1,0,2]", expectedOutput: "5" },
      { input: "[1,2,2]", expectedOutput: "4" }
    ],
    points: 200
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
    ],
    points: 200
  },
  {
    title: "Roman to Integer",
    difficulty: "Easy",
    statement: "Given a roman numeral, convert it to an integer. Roman numerals are represented by seven symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
    sampleInput: "s = \"III\"",
    sampleOutput: "3",
    testCases: [
      { input: "III", expectedOutput: "3" },
      { input: "LVIII", expectedOutput: "58" },
      { input: "MCMXCIV", expectedOutput: "1994" }
    ],
    points: 100
  },
  {
    title: "Integer to Roman",
    difficulty: "Medium",
    statement: "Given an integer, convert it to a roman numeral.",
    sampleInput: "num = 3749",
    sampleOutput: "MMMDCCXLIX",
    testCases: [
      { input: "3749", expectedOutput: "MMMDCCXLIX" },
      { input: "58", expectedOutput: "LVIII" },
      { input: "1994", expectedOutput: "MCMXCIV" }
    ],
    points: 150
  },
  {
    title: "Length of Last Word",
    difficulty: "Easy",
    statement: "Given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.",
    sampleInput: "s = \"Hello World\"",
    sampleOutput: "5",
    testCases: [
      { input: "Hello World", expectedOutput: "5" },
      { input: "   fly me   to   the moon  ", expectedOutput: "4" },
      { input: "luffy is still joyboy", expectedOutput: "6" }
    ],
    points: 100
  },
  {
    title: "Longest Common Prefix",
    difficulty: "Easy",
    statement: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    sampleInput: "strs = [\"flower\",\"flow\",\"flight\"]",
    sampleOutput: "fl",
    testCases: [
      { input: "[\"flower\",\"flow\",\"flight\"]", expectedOutput: "fl" },
      { input: "[\"dog\",\"racecar\",\"car\"]", expectedOutput: "" }
    ],
    points: 100
  },
  {
    title: "Reverse Words in a String",
    difficulty: "Medium",
    statement: "Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space.",
    sampleInput: "s = \"the sky is blue\"",
    sampleOutput: "blue is sky the",
    testCases: [
      { input: "the sky is blue", expectedOutput: "blue is sky the" },
      { input: "  hello world  ", expectedOutput: "world hello" }
    ],
    points: 150
  },
  {
    title: "Zigzag Conversion",
    difficulty: "Medium",
    statement: "The string 'PAYPALISHIRING' is written in a zigzag pattern on a given number of rows. Write the code that will take a string and make this conversion given a number of rows.",
    sampleInput: "s = \"PAYPALISHIRING\", numRows = 3",
    sampleOutput: "PAHNAPLSIIGYIR",
    testCases: [
      { input: "PAYPALISHIRING\n3", expectedOutput: "PAHNAPLSIIGYIR" },
      { input: "PAYPALISHIRING\n4", expectedOutput: "PINALSIGYAHRPI" },
      { input: "A\n1", expectedOutput: "A" }
    ],
    points: 150
  },
  {
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    statement: "Given two strings haystack and needle, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
    sampleInput: "haystack = \"sadbutsad\", needle = \"sad\"",
    sampleOutput: "0",
    testCases: [
      { input: "sadbutsad\nsad", expectedOutput: "0" },
      { input: "leetcode\nleeto", expectedOutput: "-1" }
    ],
    points: 100
  },
  {
    title: "Text Justification",
    difficulty: "Hard",
    statement: "Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified.",
    sampleInput: "words = [\"This\", \"is\", \"an\", \"example\"], maxWidth = 16",
    sampleOutput: "[\"This    is    an\",\"example        \"]",
    testCases: [
      { input: "[\"This\",\"is\",\"an\",\"example\"]\n16", expectedOutput: "[\"This    is    an\",\"example        \"]" }
    ],
    points: 200
  },

  // ─────────────────── TWO POINTERS (5) ───────────────────
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    statement: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    sampleInput: "s = \"A man, a plan, a canal: Panama\"",
    sampleOutput: "true",
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
      { input: "race a car", expectedOutput: "false" },
      { input: " ", expectedOutput: "true" }
    ],
    points: 100
  },
  {
    title: "Is Subsequence",
    difficulty: "Easy",
    statement: "Given two strings s and t, return true if s is a subsequence of t, or false otherwise. A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.",
    sampleInput: "s = \"abc\", t = \"ahbgdc\"",
    sampleOutput: "true",
    testCases: [
      { input: "abc\nahbgdc", expectedOutput: "true" },
      { input: "axc\nahbgdc", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Medium",
    statement: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers (1-indexed).",
    sampleInput: "numbers = [2,7,11,15], target = 9",
    sampleOutput: "[1,2]",
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[1,2]" },
      { input: "[2,3,4]\n6", expectedOutput: "[1,3]" },
      { input: "[-1,0]\n-1", expectedOutput: "[1,2]" }
    ],
    points: 150
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    statement: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]",
    sampleOutput: "49",
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { input: "[1,1]", expectedOutput: "1" }
    ],
    points: 150
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    statement: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
    sampleInput: "nums = [-1,0,1,2,-1,-4]",
    sampleOutput: "[[-1,-1,2],[-1,0,1]]",
    testCases: [
      { input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
      { input: "[0,1,1]", expectedOutput: "[]" },
      { input: "[0,0,0]", expectedOutput: "[[0,0,0]]" }
    ],
    points: 150
  },

  // ─────────────────── SLIDING WINDOW (4) ───────────────────
  {
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    statement: "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.",
    sampleInput: "target = 7, nums = [2,3,1,2,4,3]",
    sampleOutput: "2",
    testCases: [
      { input: "7\n[2,3,1,2,4,3]", expectedOutput: "2" },
      { input: "4\n[1,4,4]", expectedOutput: "1" },
      { input: "11\n[1,1,1,1,1,1,1,1]", expectedOutput: "0" }
    ],
    points: 150
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
    ],
    points: 150
  },
  {
    title: "Substring with Concatenation of All Words",
    difficulty: "Hard",
    statement: "You are given a string s and an array of strings words. All the strings of words are of the same length. A concatenated string is a string that exactly contains all the strings of any permutation of words concatenated. Return an array of the starting indices of all the concatenated substrings in s.",
    sampleInput: "s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]",
    sampleOutput: "[0,9]",
    testCases: [
      { input: "barfoothefoobarman\n[\"foo\",\"bar\"]", expectedOutput: "[0,9]" },
      { input: "wordgoodgoodgoodbestword\n[\"word\",\"good\",\"best\",\"word\"]", expectedOutput: "[]" }
    ],
    points: 200
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    statement: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.",
    sampleInput: "s = \"ADOBECODEBANC\", t = \"ABC\"",
    sampleOutput: "BANC",
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC" },
      { input: "a\na", expectedOutput: "a" },
      { input: "a\naa", expectedOutput: "" }
    ],
    points: 200
  },

  // ─────────────────── MATRIX (5) ───────────────────
  {
    title: "Valid Sudoku",
    difficulty: "Medium",
    statement: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules: each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition.",
    sampleInput: "board = [[\"5\",\"3\",\".\",\".\",\"7\",...],...]",
    sampleOutput: "true",
    testCases: [
      { input: "valid_board", expectedOutput: "true" },
      { input: "invalid_board", expectedOutput: "false" }
    ],
    points: 150
  },
  {
    title: "Spiral Matrix",
    difficulty: "Medium",
    statement: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    sampleOutput: "[1,2,3,6,9,8,7,4,5]",
    testCases: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1,2,3,6,9,8,7,4,5]" },
      { input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    points: 150
  },
  {
    title: "Rotate Image",
    difficulty: "Medium",
    statement: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    sampleOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
    testCases: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
    ],
    points: 150
  },
  {
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    statement: "Given an m x n integer matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
    sampleInput: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
    sampleOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
    testCases: [
      { input: "[[1,1,1],[1,0,1],[1,1,1]]", expectedOutput: "[[1,0,1],[0,0,0],[1,0,1]]" },
      { input: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]", expectedOutput: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" }
    ],
    points: 150
  },
  {
    title: "Game of Life",
    difficulty: "Medium",
    statement: "According to Wikipedia's article: The Game of Life is a cellular automaton devised by John Horton Conway. The board is made up of an m x n grid of cells, where each cell has an initial state: live (1) or dead (0). Each cell interacts with its eight neighbors using four rules. Implement the next state of the board.",
    sampleInput: "board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]",
    sampleOutput: "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]",
    testCases: [
      { input: "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", expectedOutput: "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" },
      { input: "[[1,1],[1,0]]", expectedOutput: "[[1,1],[1,1]]" }
    ],
    points: 150
  },

  // ─────────────────── HASHMAP (9) ───────────────────
  {
    title: "Ransom Note",
    difficulty: "Easy",
    statement: "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise. Each letter in magazine can only be used once in ransomNote.",
    sampleInput: "ransomNote = \"a\", magazine = \"b\"",
    sampleOutput: "false",
    testCases: [
      { input: "a\nb", expectedOutput: "false" },
      { input: "aa\nab", expectedOutput: "false" },
      { input: "aa\naab", expectedOutput: "true" }
    ],
    points: 100
  },
  {
    title: "Isomorphic Strings",
    difficulty: "Easy",
    statement: "Given two strings s and t, determine if they are isomorphic. Two strings s and t are isomorphic if the characters in s can be replaced to get t, with a one-to-one mapping.",
    sampleInput: "s = \"egg\", t = \"add\"",
    sampleOutput: "true",
    testCases: [
      { input: "egg\nadd", expectedOutput: "true" },
      { input: "foo\nbar", expectedOutput: "false" },
      { input: "paper\ntitle", expectedOutput: "true" }
    ],
    points: 100
  },
  {
    title: "Word Pattern",
    difficulty: "Easy",
    statement: "Given a pattern and a string s, find if s follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.",
    sampleInput: "pattern = \"abba\", s = \"dog cat cat dog\"",
    sampleOutput: "true",
    testCases: [
      { input: "abba\ndog cat cat dog", expectedOutput: "true" },
      { input: "abba\ndog cat cat fish", expectedOutput: "false" },
      { input: "aaaa\ndog cat cat dog", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    statement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.",
    sampleInput: "s = \"anagram\", t = \"nagaram\"",
    sampleOutput: "true",
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true" },
      { input: "rat\ncar", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    statement: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    sampleInput: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
    sampleOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
    testCases: [
      { input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      { input: "[\"\"]", expectedOutput: "[[\"\"]]" },
      { input: "[\"a\"]", expectedOutput: "[[\"a\"]]" }
    ],
    points: 150
  },
  {
    title: "Two Sum",
    difficulty: "Easy",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" }
    ],
    points: 100
  },
  {
    title: "Happy Number",
    difficulty: "Easy",
    statement: "Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.",
    sampleInput: "n = 19",
    sampleOutput: "true",
    testCases: [
      { input: "19", expectedOutput: "true" },
      { input: "2", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Contains Duplicate II",
    difficulty: "Easy",
    statement: "Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.",
    sampleInput: "nums = [1,2,3,1], k = 3",
    sampleOutput: "true",
    testCases: [
      { input: "[1,2,3,1]\n3", expectedOutput: "true" },
      { input: "[1,0,1,1]\n1", expectedOutput: "true" },
      { input: "[1,2,3,1,2,3]\n2", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    statement: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    sampleInput: "nums = [100,4,200,1,3,2]",
    sampleOutput: "4",
    testCases: [
      { input: "[100,4,200,1,3,2]", expectedOutput: "4" },
      { input: "[0,3,7,2,5,8,4,6,0,1]", expectedOutput: "9" }
    ],
    points: 150
  },

  // ─────────────────── INTERVALS (4) ───────────────────
  {
    title: "Summary Ranges",
    difficulty: "Easy",
    statement: "You are given a sorted unique integer array nums. A range [a,b] is the set of all integers from a to b (inclusive). Return the smallest sorted list of ranges that cover all the numbers in the array exactly.",
    sampleInput: "nums = [0,1,2,4,5,7]",
    sampleOutput: "[\"0->2\",\"4->5\",\"7\"]",
    testCases: [
      { input: "[0,1,2,4,5,7]", expectedOutput: "[\"0->2\",\"4->5\",\"7\"]" },
      { input: "[0,2,3,4,6,8,9]", expectedOutput: "[\"0\",\"2->4\",\"6\",\"8->9\"]" }
    ],
    points: 100
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    statement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    sampleInput: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
    sampleOutput: "[[1,6],[8,10],[15,18]]",
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" }
    ],
    points: 150
  },
  {
    title: "Insert Interval",
    difficulty: "Medium",
    statement: "You are given an array of non-overlapping intervals intervals sorted by starti in ascending order and a new interval newInterval. Insert newInterval into intervals such that intervals is still sorted and non-overlapping (merge if necessary).",
    sampleInput: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
    sampleOutput: "[[1,5],[6,9]]",
    testCases: [
      { input: "[[1,3],[6,9]]\n[2,5]", expectedOutput: "[[1,5],[6,9]]" },
      { input: "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]", expectedOutput: "[[1,2],[3,10],[12,16]]" }
    ],
    points: 150
  },
  {
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    statement: "There are some spherical balloons taped onto a flat wall represented as a 2D plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend]. An arrow can be shot vertically (bottom to top) at x. A balloon with xstart <= x <= xend is burst. Return the minimum number of arrows that must be shot to burst all balloons.",
    sampleInput: "points = [[10,16],[2,8],[1,6],[7,12]]",
    sampleOutput: "2",
    testCases: [
      { input: "[[10,16],[2,8],[1,6],[7,12]]", expectedOutput: "2" },
      { input: "[[1,2],[3,4],[5,6],[7,8]]", expectedOutput: "4" },
      { input: "[[1,2],[2,3],[3,4],[4,5]]", expectedOutput: "2" }
    ],
    points: 150
  },

  // ─────────────────── STACK (7) ───────────────────
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.",
    sampleInput: "s = \"()\"",
    sampleOutput: "true",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Simplify Path",
    difficulty: "Medium",
    statement: "Given an absolute path for a Unix-style file system, simplify it to its canonical path. In a canonical path: the path starts with '/', any two consecutive slashes are replaced by a single one, the path does not end with '/', and it only contains the directories on the path from the root to the target file or directory.",
    sampleInput: "path = \"/home/\"",
    sampleOutput: "/home",
    testCases: [
      { input: "/home/", expectedOutput: "/home" },
      { input: "/home//foo/", expectedOutput: "/home/foo" },
      { input: "/home/user/Documents/../Pictures", expectedOutput: "/home/user/Pictures" }
    ],
    points: 150
  },
  {
    title: "Min Stack",
    difficulty: "Medium",
    statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with push(val), pop(), top(), and getMin() methods.",
    sampleInput: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
    sampleOutput: "-3, 0, -2",
    testCases: [
      { input: "push(-2)\npush(0)\npush(-3)\ngetMin()\npop()\ntop()\ngetMin()", expectedOutput: "-3\n0\n-2" }
    ],
    points: 150
  },
  {
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    statement: "You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression and return an integer that represents the value.",
    sampleInput: "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]",
    sampleOutput: "9",
    testCases: [
      { input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]", expectedOutput: "9" },
      { input: "[\"4\",\"13\",\"5\",\"/\",\"+\"]", expectedOutput: "6" },
      { input: "[\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]", expectedOutput: "22" }
    ],
    points: 150
  },
  {
    title: "Basic Calculator",
    difficulty: "Hard",
    statement: "Given a string s representing a valid expression, implement a basic calculator to evaluate it and return the result. The expression string may contain '+', '-', '(', ')', digits and spaces.",
    sampleInput: "s = \"1 + 1\"",
    sampleOutput: "2",
    testCases: [
      { input: "1 + 1", expectedOutput: "2" },
      { input: " 2-1 + 2 ", expectedOutput: "3" },
      { input: "(1+(4+5+2)-3)+(6+8)", expectedOutput: "23" }
    ],
    points: 200
  },

  // ─────────────────── LINKED LIST (11) ───────────────────
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    statement: "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, false otherwise.",
    sampleInput: "head = [3,2,0,-4], pos = 1",
    sampleOutput: "true",
    testCases: [
      { input: "[3,2,0,-4]\n1", expectedOutput: "true" },
      { input: "[1,2]\n0", expectedOutput: "true" },
      { input: "[1]\n-1", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    statement: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    sampleInput: "l1 = [2,4,3], l2 = [5,6,4]",
    sampleOutput: "[7,0,8]",
    testCases: [
      { input: "[2,4,3]\n[5,6,4]", expectedOutput: "[7,0,8]" },
      { input: "[0]\n[0]", expectedOutput: "[0]" },
      { input: "[9,9,9,9,9,9,9]\n[9,9,9,9]", expectedOutput: "[8,9,9,9,0,0,0,1]" }
    ],
    points: 150
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    statement: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    sampleInput: "list1 = [1,2,4], list2 = [1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", expectedOutput: "[]" },
      { input: "[]\n[0]", expectedOutput: "[0]" }
    ],
    points: 100
  },
  {
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    statement: "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list.",
    sampleInput: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
    sampleOutput: "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
    testCases: [
      { input: "[[7,null],[13,0],[11,4],[10,2],[1,0]]", expectedOutput: "[[7,null],[13,0],[11,4],[10,2],[1,0]]" }
    ],
    points: 150
  },
  {
    title: "Reverse Linked List II",
    difficulty: "Medium",
    statement: "Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list.",
    sampleInput: "head = [1,2,3,4,5], left = 2, right = 4",
    sampleOutput: "[1,4,3,2,5]",
    testCases: [
      { input: "[1,2,3,4,5]\n2\n4", expectedOutput: "[1,4,3,2,5]" },
      { input: "[5]\n1\n1", expectedOutput: "[5]" }
    ],
    points: 150
  },
  {
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    statement: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.",
    sampleInput: "head = [1,2,3,4,5], k = 2",
    sampleOutput: "[2,1,4,3,5]",
    testCases: [
      { input: "[1,2,3,4,5]\n2", expectedOutput: "[2,1,4,3,5]" },
      { input: "[1,2,3,4,5]\n3", expectedOutput: "[3,2,1,4,5]" }
    ],
    points: 200
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    statement: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    sampleInput: "head = [1,2,3,4,5], n = 2",
    sampleOutput: "[1,2,3,5]",
    testCases: [
      { input: "[1,2,3,4,5]\n2", expectedOutput: "[1,2,3,5]" },
      { input: "[1]\n1", expectedOutput: "[]" },
      { input: "[1,2]\n1", expectedOutput: "[1]" }
    ],
    points: 150
  },
  {
    title: "Remove Duplicates from Sorted List II",
    difficulty: "Medium",
    statement: "Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.",
    sampleInput: "head = [1,2,3,3,4,4,5]",
    sampleOutput: "[1,2,5]",
    testCases: [
      { input: "[1,2,3,3,4,4,5]", expectedOutput: "[1,2,5]" },
      { input: "[1,1,1,2,3]", expectedOutput: "[2,3]" }
    ],
    points: 150
  },
  {
    title: "Rotate List",
    difficulty: "Medium",
    statement: "Given the head of a linked list, rotate the list to the right by k places.",
    sampleInput: "head = [1,2,3,4,5], k = 2",
    sampleOutput: "[4,5,1,2,3]",
    testCases: [
      { input: "[1,2,3,4,5]\n2", expectedOutput: "[4,5,1,2,3]" },
      { input: "[0,1,2]\n4", expectedOutput: "[2,0,1]" }
    ],
    points: 150
  },
  {
    title: "Partition List",
    difficulty: "Medium",
    statement: "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x. You should preserve the original relative order of the nodes in each of the two partitions.",
    sampleInput: "head = [1,4,3,2,5,2], x = 3",
    sampleOutput: "[1,2,2,4,3,5]",
    testCases: [
      { input: "[1,4,3,2,5,2]\n3", expectedOutput: "[1,2,2,4,3,5]" },
      { input: "[2,1]\n2", expectedOutput: "[1,2]" }
    ],
    points: 150
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    statement: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) methods that run in O(1) average time complexity.",
    sampleInput: "LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)",
    sampleOutput: "1, -1, -1, 3, 4",
    testCases: [
      { input: "LRUCache(2)\nput(1,1)\nput(2,2)\nget(1)\nput(3,3)\nget(2)", expectedOutput: "1\n-1" }
    ],
    points: 150
  },

  // ─────────────────── BINARY TREE GENERAL (14) ───────────────────
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    statement: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "3",
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "3" },
      { input: "[1,null,2]", expectedOutput: "2" }
    ],
    points: 100
  },
  {
    title: "Same Tree",
    difficulty: "Easy",
    statement: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical and the nodes have the same value.",
    sampleInput: "p = [1,2,3], q = [1,2,3]",
    sampleOutput: "true",
    testCases: [
      { input: "[1,2,3]\n[1,2,3]", expectedOutput: "true" },
      { input: "[1,2]\n[1,null,2]", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    statement: "Given the root of a binary tree, invert the tree, and return its root.",
    sampleInput: "root = [4,2,7,1,3,6,9]",
    sampleOutput: "[4,7,2,9,6,3,1]",
    testCases: [
      { input: "[4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]" },
      { input: "[2,1,3]", expectedOutput: "[2,3,1]" }
    ],
    points: 100
  },
  {
    title: "Symmetric Tree",
    difficulty: "Easy",
    statement: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    sampleInput: "root = [1,2,2,3,4,4,3]",
    sampleOutput: "true",
    testCases: [
      { input: "[1,2,2,3,4,4,3]", expectedOutput: "true" },
      { input: "[1,2,2,null,3,null,3]", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    statement: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    sampleInput: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
    sampleOutput: "[3,9,20,null,null,15,7]",
    testCases: [
      { input: "[3,9,20,15,7]\n[9,3,15,20,7]", expectedOutput: "[3,9,20,null,null,15,7]" },
      { input: "[-1]\n[-1]", expectedOutput: "[-1]" }
    ],
    points: 150
  },
  {
    title: "Construct Binary Tree from Inorder and Postorder Traversal",
    difficulty: "Medium",
    statement: "Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.",
    sampleInput: "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]",
    sampleOutput: "[3,9,20,null,null,15,7]",
    testCases: [
      { input: "[9,3,15,20,7]\n[9,15,7,20,3]", expectedOutput: "[3,9,20,null,null,15,7]" },
      { input: "[-1]\n[-1]", expectedOutput: "[-1]" }
    ],
    points: 150
  },
  {
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Medium",
    statement: "Given the root of a binary tree, flatten the tree into a linked list. The linked list should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null.",
    sampleInput: "root = [1,2,5,3,4,null,6]",
    sampleOutput: "[1,null,2,null,3,null,4,null,5,null,6]",
    testCases: [
      { input: "[1,2,5,3,4,null,6]", expectedOutput: "[1,null,2,null,3,null,4,null,5,null,6]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    points: 150
  },
  {
    title: "Path Sum",
    difficulty: "Easy",
    statement: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
    sampleInput: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
    sampleOutput: "true",
    testCases: [
      { input: "[5,4,8,11,null,13,4,7,2,null,null,null,1]\n22", expectedOutput: "true" },
      { input: "[1,2,3]\n5", expectedOutput: "false" }
    ],
    points: 100
  },
  {
    title: "Sum Root to Leaf Numbers",
    difficulty: "Medium",
    statement: "You are given the root of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path in the tree represents a number. Return the total sum of all root-to-leaf numbers.",
    sampleInput: "root = [1,2,3]",
    sampleOutput: "25",
    testCases: [
      { input: "[1,2,3]", expectedOutput: "25" },
      { input: "[4,9,0,5,1]", expectedOutput: "1026" }
    ],
    points: 150
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    statement: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. The path sum is the sum of the node values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    sampleInput: "root = [1,2,3]",
    sampleOutput: "6",
    testCases: [
      { input: "[1,2,3]", expectedOutput: "6" },
      { input: "[-10,9,20,null,null,15,7]", expectedOutput: "42" }
    ],
    points: 200
  },
  {
    title: "Count Complete Tree Nodes",
    difficulty: "Easy",
    statement: "Given the root of a complete binary tree, return the number of the nodes in the tree. Design an algorithm that runs in less than O(n) time complexity.",
    sampleInput: "root = [1,2,3,4,5,6]",
    sampleOutput: "6",
    testCases: [
      { input: "[1,2,3,4,5,6]", expectedOutput: "6" },
      { input: "[]", expectedOutput: "0" },
      { input: "[1]", expectedOutput: "1" }
    ],
    points: 100
  },
  {
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    statement: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. The LCA is defined as the lowest node in the tree that has both p and q as descendants (where we allow a node to be a descendant of itself).",
    sampleInput: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
    sampleOutput: "3",
    testCases: [
      { input: "[3,5,1,6,2,0,8,null,null,7,4]\n5\n1", expectedOutput: "3" },
      { input: "[3,5,1,6,2,0,8,null,null,7,4]\n5\n4", expectedOutput: "5" }
    ],
    points: 150
  },
  {
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    statement: "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
    sampleInput: "root = [1,2,3,null,5,null,4]",
    sampleOutput: "[1,3,4]",
    testCases: [
      { input: "[1,2,3,null,5,null,4]", expectedOutput: "[1,3,4]" },
      { input: "[1,null,3]", expectedOutput: "[1,3]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    points: 150
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    statement: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "[[3],[9,20],[15,7]]",
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]" },
      { input: "[1]", expectedOutput: "[[1]]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    points: 150
  },

  // ─────────────────── BINARY TREE BFS (3) ───────────────────
  {
    title: "Average of Levels in Binary Tree",
    difficulty: "Easy",
    statement: "Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "[3.00000,14.50000,11.00000]",
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "[3.00000,14.50000,11.00000]" },
      { input: "[3,9,20,15,7]", expectedOutput: "[3.00000,14.50000,11.00000]" }
    ],
    points: 100
  },
  {
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    statement: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "[[3],[20,9],[15,7]]",
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[20,9],[15,7]]" },
      { input: "[1]", expectedOutput: "[[1]]" }
    ],
    points: 150
  },

  // ─────────────────── BINARY SEARCH TREE (3) ───────────────────
  {
    title: "Minimum Absolute Difference in BST",
    difficulty: "Easy",
    statement: "Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.",
    sampleInput: "root = [4,2,6,1,3]",
    sampleOutput: "1",
    testCases: [
      { input: "[4,2,6,1,3]", expectedOutput: "1" },
      { input: "[1,0,48,null,null,12,49]", expectedOutput: "1" }
    ],
    points: 100
  },
  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    statement: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    sampleInput: "root = [3,1,4,null,2], k = 1",
    sampleOutput: "1",
    testCases: [
      { input: "[3,1,4,null,2]\n1", expectedOutput: "1" },
      { input: "[5,3,6,2,4,null,null,1]\n3", expectedOutput: "3" }
    ],
    points: 150
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has all left subtree values less than the node and all right subtree values greater.",
    sampleInput: "root = [2,1,3]",
    sampleOutput: "true",
    testCases: [
      { input: "[2,1,3]", expectedOutput: "true" },
      { input: "[5,1,4,null,null,3,6]", expectedOutput: "false" }
    ],
    points: 150
  },

  // ─────────────────── GRAPH GENERAL (6) ───────────────────
  {
    title: "Number of Islands",
    difficulty: "Medium",
    statement: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    sampleInput: "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
    sampleOutput: "1",
    testCases: [
      { input: "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", expectedOutput: "3" },
      { input: "[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]", expectedOutput: "1" }
    ],
    points: 150
  },
  {
    title: "Surrounded Regions",
    difficulty: "Medium",
    statement: "Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'. A region is captured by flipping all 'O's into 'X's in that surrounded region.",
    sampleInput: "board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]",
    sampleOutput: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]",
    testCases: [
      { input: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]", expectedOutput: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]" }
    ],
    points: 150
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    statement: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    sampleInput: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
    sampleOutput: "[[2,4],[1,3],[2,4],[1,3]]",
    testCases: [
      { input: "[[2,4],[1,3],[2,4],[1,3]]", expectedOutput: "[[2,4],[1,3],[2,4],[1,3]]" },
      { input: "[[]]", expectedOutput: "[[]]" }
    ],
    points: 150
  },
  {
    title: "Evaluate Division",
    difficulty: "Medium",
    statement: "You are given an array of variable pairs equations and an array of real numbers values, where equations[i] = [Ai, Bi] and values[i] represent the equation Ai / Bi = values[i]. Given some queries, return the answers. If the answer does not exist, return -1.0.",
    sampleInput: "equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"]]",
    sampleOutput: "[6.00000]",
    testCases: [
      { input: "[[\"a\",\"b\"],[\"b\",\"c\"]]\n[2.0,3.0]\n[[\"a\",\"c\"],[\"b\",\"a\"]]", expectedOutput: "[6.00000,0.50000]" }
    ],
    points: 150
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    statement: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses, false otherwise.",
    sampleInput: "numCourses = 2, prerequisites = [[1,0]]",
    sampleOutput: "true",
    testCases: [
      { input: "2\n[[1,0]]", expectedOutput: "true" },
      { input: "2\n[[1,0],[0,1]]", expectedOutput: "false" }
    ],
    points: 150
  },
  {
    title: "Course Schedule II",
    difficulty: "Medium",
    statement: "There are a total of numCourses courses you have to take. You are given an array prerequisites. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.",
    sampleInput: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
    sampleOutput: "[0,2,1,3]",
    testCases: [
      { input: "2\n[[1,0]]", expectedOutput: "[0,1]" },
      { input: "4\n[[1,0],[2,0],[3,1],[3,2]]", expectedOutput: "[0,1,2,3]" },
      { input: "1\n[]", expectedOutput: "[0]" }
    ],
    points: 150
  },

  // ─────────────────── GRAPH BFS (3) ───────────────────
  {
    title: "Snakes and Ladders",
    difficulty: "Medium",
    statement: "You are given an n x n integer matrix board where the cells are labeled from 1 to n^2 in a Boustrophedon style starting from the bottom left of the board. Return the least number of moves required to reach the square n^2. If it is not possible, return -1.",
    sampleInput: "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]",
    sampleOutput: "4",
    testCases: [
      { input: "standard_6x6_board", expectedOutput: "4" },
      { input: "[[-1,-1],[-1,3]]", expectedOutput: "1" }
    ],
    points: 150
  },
  {
    title: "Minimum Genetic Mutation",
    difficulty: "Medium",
    statement: "A gene string can be represented by an 8-character long string of characters from 'A', 'C', 'G', and 'T'. Given two gene strings startGene and endGene and a bank of valid mutations, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such mutation, return -1.",
    sampleInput: "startGene = \"AACCGGTT\", endGene = \"AACCGGTA\", bank = [\"AACCGGTA\"]",
    sampleOutput: "1",
    testCases: [
      { input: "AACCGGTT\nAACCGGTA\n[\"AACCGGTA\"]", expectedOutput: "1" },
      { input: "AACCGGTT\nAAACGGTA\n[\"AACCGGTA\",\"AACCGCTA\",\"AAACGGTA\"]", expectedOutput: "2" }
    ],
    points: 150
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    statement: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter and every si is in wordList. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
    sampleInput: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    sampleOutput: "5",
    testCases: [
      { input: "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", expectedOutput: "5" },
      { input: "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", expectedOutput: "0" }
    ],
    points: 200
  },

  // ─────────────────── TRIE (3) ───────────────────
  {
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    statement: "A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.",
    sampleInput: "insert(\"apple\"), search(\"apple\"), search(\"app\"), startsWith(\"app\"), insert(\"app\"), search(\"app\")",
    sampleOutput: "true, false, true, true",
    testCases: [
      { input: "insert(apple)\nsearch(apple)\nsearch(app)\nstartsWith(app)", expectedOutput: "true\nfalse\ntrue" }
    ],
    points: 150
  },
  {
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    statement: "Design a data structure that supports adding new words and finding if a string matches any previously added string. The search word can contain dots '.' where dots can be matched with any letter.",
    sampleInput: "addWord(\"bad\"), addWord(\"dad\"), addWord(\"mad\"), search(\"pad\"), search(\"bad\"), search(\".ad\"), search(\"b..\")",
    sampleOutput: "false, true, true, true",
    testCases: [
      { input: "addWord(bad)\naddWord(dad)\nsearch(.ad)\nsearch(b..)", expectedOutput: "true\ntrue" }
    ],
    points: 150
  },
  {
    title: "Word Search II",
    difficulty: "Hard",
    statement: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
    sampleInput: "board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]",
    sampleOutput: "[\"eat\",\"oath\"]",
    testCases: [
      { input: "[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]]\n[\"oath\",\"pea\",\"eat\",\"rain\"]", expectedOutput: "[\"eat\",\"oath\"]" }
    ],
    points: 200
  },

  // ─────────────────── BACKTRACKING (7) ───────────────────
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    statement: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. A mapping of digits to letters (just like on the telephone buttons) is given.",
    sampleInput: "digits = \"23\"",
    sampleOutput: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
    testCases: [
      { input: "23", expectedOutput: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" },
      { input: "", expectedOutput: "[]" },
      { input: "2", expectedOutput: "[\"a\",\"b\",\"c\"]" }
    ],
    points: 150
  },
  {
    title: "Combinations",
    difficulty: "Medium",
    statement: "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]. You may return the answer in any order.",
    sampleInput: "n = 4, k = 2",
    sampleOutput: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
    testCases: [
      { input: "4\n2", expectedOutput: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" },
      { input: "1\n1", expectedOutput: "[[1]]" }
    ],
    points: 150
  },
  {
    title: "Permutations",
    difficulty: "Medium",
    statement: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    sampleInput: "nums = [1,2,3]",
    sampleOutput: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
    testCases: [
      { input: "[1,2,3]", expectedOutput: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "[0,1]", expectedOutput: "[[0,1],[1,0]]" },
      { input: "[1]", expectedOutput: "[[1]]" }
    ],
    points: 150
  },
  {
    title: "Combination Sum",
    difficulty: "Medium",
    statement: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times.",
    sampleInput: "candidates = [2,3,6,7], target = 7",
    sampleOutput: "[[2,2,3],[7]]",
    testCases: [
      { input: "[2,3,6,7]\n7", expectedOutput: "[[2,2,3],[7]]" },
      { input: "[2,3,5]\n8", expectedOutput: "[[2,2,2,2],[2,3,3],[3,5]]" },
      { input: "[2]\n1", expectedOutput: "[]" }
    ],
    points: 150
  },
  {
    title: "N-Queens II",
    difficulty: "Hard",
    statement: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions to the n-queens puzzle.",
    sampleInput: "n = 4",
    sampleOutput: "2",
    testCases: [
      { input: "4", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" }
    ],
    points: 200
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    statement: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    sampleInput: "n = 3",
    sampleOutput: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
    testCases: [
      { input: "3", expectedOutput: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
      { input: "1", expectedOutput: "[\"()\"]" }
    ],
    points: 150
  },
  {
    title: "Word Search",
    difficulty: "Medium",
    statement: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    sampleInput: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
    sampleOutput: "true",
    testCases: [
      { input: "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCCED", expectedOutput: "true" },
      { input: "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nSEE", expectedOutput: "true" },
      { input: "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCB", expectedOutput: "false" }
    ],
    points: 150
  },

  // ─────────────────── DIVIDE & CONQUER (4) ───────────────────
  {
    title: "Convert Sorted Array to Binary Search Tree",
    difficulty: "Easy",
    statement: "Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.",
    sampleInput: "nums = [-10,-3,0,5,9]",
    sampleOutput: "[0,-3,9,-10,null,5]",
    testCases: [
      { input: "[-10,-3,0,5,9]", expectedOutput: "[0,-3,9,-10,null,5]" },
      { input: "[1,3]", expectedOutput: "[3,1]" }
    ],
    points: 100
  },
  {
    title: "Sort List",
    difficulty: "Medium",
    statement: "Given the head of a linked list, return the list after sorting it in ascending order.",
    sampleInput: "head = [4,2,1,3]",
    sampleOutput: "[1,2,3,4]",
    testCases: [
      { input: "[4,2,1,3]", expectedOutput: "[1,2,3,4]" },
      { input: "[-1,5,3,4,0]", expectedOutput: "[-1,0,3,4,5]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    points: 150
  },
  {
    title: "Construct Quad Tree",
    difficulty: "Medium",
    statement: "Given a n * n matrix grid of 0's and 1's only, represent grid with a Quad-Tree and return the root of the Quad-Tree representing grid.",
    sampleInput: "grid = [[0,1],[1,0]]",
    sampleOutput: "[[0,1],[1,0],[1,1],[1,1],[1,0]]",
    testCases: [
      { input: "[[0,1],[1,0]]", expectedOutput: "Quad-Tree representation" },
      { input: "[[1,1],[1,1]]", expectedOutput: "[[1,1]]" }
    ],
    points: 150
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    statement: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,3,4,4,5,6]",
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { input: "[]", expectedOutput: "[]" },
      { input: "[[]]", expectedOutput: "[]" }
    ],
    points: 200
  },

  // ─────────────────── KADANE'S ALGORITHM (2) ───────────────────
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    statement: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
    sampleOutput: "6",
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23" }
    ],
    points: 150
  },
  {
    title: "Maximum Sum Circular Subarray",
    difficulty: "Medium",
    statement: "Given a circular integer array nums, find the maximum possible sum of a non-empty subarray of nums. A circular array means the end of the array connects to the beginning of the array.",
    sampleInput: "nums = [1,-2,3,-2]",
    sampleOutput: "3",
    testCases: [
      { input: "[1,-2,3,-2]", expectedOutput: "3" },
      { input: "[5,-3,5]", expectedOutput: "10" },
      { input: "[-3,-2,-3]", expectedOutput: "-2" }
    ],
    points: 150
  },

  // ─────────────────── BINARY SEARCH (7) ───────────────────
  {
    title: "Search Insert Position",
    difficulty: "Easy",
    statement: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    sampleInput: "nums = [1,3,5,6], target = 5",
    sampleOutput: "2",
    testCases: [
      { input: "[1,3,5,6]\n5", expectedOutput: "2" },
      { input: "[1,3,5,6]\n2", expectedOutput: "1" },
      { input: "[1,3,5,6]\n7", expectedOutput: "4" }
    ],
    points: 100
  },
  {
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    statement: "You are given an m x n integer matrix with each row sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise.",
    sampleInput: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
    sampleOutput: "true",
    testCases: [
      { input: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n3", expectedOutput: "true" },
      { input: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n13", expectedOutput: "false" }
    ],
    points: 150
  },
  {
    title: "Find Peak Element",
    difficulty: "Medium",
    statement: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element and return its index. If the array contains multiple peaks, return the index to any of the peaks.",
    sampleInput: "nums = [1,2,3,1]",
    sampleOutput: "2",
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "2" },
      { input: "[1,2,1,3,5,6,4]", expectedOutput: "5" }
    ],
    points: 150
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    statement: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not.",
    sampleInput: "nums = [4,5,6,7,0,1,2], target = 0",
    sampleOutput: "4",
    testCases: [
      { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4" },
      { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1" },
      { input: "[1]\n0", expectedOutput: "-1" }
    ],
    points: 150
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    statement: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
    sampleInput: "nums = [5,7,7,8,8,10], target = 8",
    sampleOutput: "[3,4]",
    testCases: [
      { input: "[5,7,7,8,8,10]\n8", expectedOutput: "[3,4]" },
      { input: "[5,7,7,8,8,10]\n6", expectedOutput: "[-1,-1]" },
      { input: "[]\n0", expectedOutput: "[-1,-1]" }
    ],
    points: 150
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    statement: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    sampleInput: "nums = [3,4,5,1,2]",
    sampleOutput: "1",
    testCases: [
      { input: "[3,4,5,1,2]", expectedOutput: "1" },
      { input: "[4,5,6,7,0,1,2]", expectedOutput: "0" },
      { input: "[11,13,15,17]", expectedOutput: "11" }
    ],
    points: 150
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    statement: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    sampleInput: "nums1 = [1,3], nums2 = [2]",
    sampleOutput: "2.00000",
    testCases: [
      { input: "[1,3]\n[2]", expectedOutput: "2.00000" },
      { input: "[1,2]\n[3,4]", expectedOutput: "2.50000" }
    ],
    points: 200
  },

  // ─────────────────── HEAP / PRIORITY QUEUE (4) ───────────────────
  {
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    statement: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
    sampleInput: "nums = [3,2,1,5,6,4], k = 2",
    sampleOutput: "5",
    testCases: [
      { input: "[3,2,1,5,6,4]\n2", expectedOutput: "5" },
      { input: "[3,2,3,1,2,4,5,5,6]\n4", expectedOutput: "4" }
    ],
    points: 150
  },
  {
    title: "IPO",
    difficulty: "Hard",
    statement: "Suppose LeetCode will start its IPO soon. In order to sell a good price of shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. You are given n projects where the ith project has a pure profit profits[i] and a minimum capital of capital[i] is needed to start it. You have w initial capital. Return the maximized capital after finishing at most k distinct projects.",
    sampleInput: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]",
    sampleOutput: "4",
    testCases: [
      { input: "2\n0\n[1,2,3]\n[0,1,1]", expectedOutput: "4" },
      { input: "3\n0\n[1,2,3]\n[0,1,2]", expectedOutput: "6" }
    ],
    points: 200
  },
  {
    title: "Find K Pairs with Smallest Sums",
    difficulty: "Medium",
    statement: "You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k. Return the k pairs (u, v) with the smallest sums, where u is from nums1 and v is from nums2.",
    sampleInput: "nums1 = [1,7,11], nums2 = [2,4,6], k = 3",
    sampleOutput: "[[1,2],[1,4],[1,6]]",
    testCases: [
      { input: "[1,7,11]\n[2,4,6]\n3", expectedOutput: "[[1,2],[1,4],[1,6]]" },
      { input: "[1,1,2]\n[1,2,3]\n2", expectedOutput: "[[1,1],[1,1]]" }
    ],
    points: 150
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    statement: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class with addNum(num) and findMedian() methods.",
    sampleInput: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()",
    sampleOutput: "1.5, 2.0",
    testCases: [
      { input: "addNum(1)\naddNum(2)\nfindMedian()\naddNum(3)\nfindMedian()", expectedOutput: "1.5\n2.0" }
    ],
    points: 200
  },

  // ─────────────────── BIT MANIPULATION (6) ───────────────────
  {
    title: "Add Binary",
    difficulty: "Easy",
    statement: "Given two binary strings a and b, return their sum as a binary string.",
    sampleInput: "a = \"11\", b = \"1\"",
    sampleOutput: "100",
    testCases: [
      { input: "11\n1", expectedOutput: "100" },
      { input: "1010\n1011", expectedOutput: "10101" }
    ],
    points: 100
  },
  {
    title: "Reverse Bits",
    difficulty: "Easy",
    statement: "Reverse bits of a given 32 bits unsigned integer.",
    sampleInput: "n = 00000010100101000001111010011100",
    sampleOutput: "964176192",
    testCases: [
      { input: "43261596", expectedOutput: "964176192" },
      { input: "4294967293", expectedOutput: "3221225471" }
    ],
    points: 100
  },
  {
    title: "Number of 1 Bits",
    difficulty: "Easy",
    statement: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (Hamming weight).",
    sampleInput: "n = 11",
    sampleOutput: "3",
    testCases: [
      { input: "11", expectedOutput: "3" },
      { input: "128", expectedOutput: "1" },
      { input: "2147483645", expectedOutput: "30" }
    ],
    points: 100
  },
  {
    title: "Single Number",
    difficulty: "Easy",
    statement: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    sampleInput: "nums = [2,2,1]",
    sampleOutput: "1",
    testCases: [
      { input: "[2,2,1]", expectedOutput: "1" },
      { input: "[4,1,2,1,2]", expectedOutput: "4" },
      { input: "[1]", expectedOutput: "1" }
    ],
    points: 100
  },
  {
    title: "Single Number II",
    difficulty: "Medium",
    statement: "Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    sampleInput: "nums = [2,2,3,2]",
    sampleOutput: "3",
    testCases: [
      { input: "[2,2,3,2]", expectedOutput: "3" },
      { input: "[0,1,0,1,0,1,99]", expectedOutput: "99" }
    ],
    points: 150
  },
  {
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    statement: "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    sampleInput: "left = 5, right = 7",
    sampleOutput: "4",
    testCases: [
      { input: "5\n7", expectedOutput: "4" },
      { input: "0\n0", expectedOutput: "0" },
      { input: "1\n2147483647", expectedOutput: "0" }
    ],
    points: 150
  },

  // ─────────────────── MATH (6) ───────────────────
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
    ],
    points: 100
  },
  {
    title: "Plus One",
    difficulty: "Easy",
    statement: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    sampleInput: "digits = [1,2,3]",
    sampleOutput: "[1,2,4]",
    testCases: [
      { input: "[1,2,3]", expectedOutput: "[1,2,4]" },
      { input: "[4,3,2,1]", expectedOutput: "[4,3,2,2]" },
      { input: "[9]", expectedOutput: "[1,0]" }
    ],
    points: 100
  },
  {
    title: "Factorial Trailing Zeroes",
    difficulty: "Medium",
    statement: "Given an integer n, return the number of trailing zeroes in n!. Note that n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1.",
    sampleInput: "n = 3",
    sampleOutput: "0",
    testCases: [
      { input: "3", expectedOutput: "0" },
      { input: "5", expectedOutput: "1" },
      { input: "0", expectedOutput: "0" }
    ],
    points: 150
  },
  {
    title: "Sqrt(x)",
    difficulty: "Easy",
    statement: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well. You must not use any built-in exponent function or operator.",
    sampleInput: "x = 4",
    sampleOutput: "2",
    testCases: [
      { input: "4", expectedOutput: "2" },
      { input: "8", expectedOutput: "2" }
    ],
    points: 100
  },
  {
    title: "Pow(x, n)",
    difficulty: "Medium",
    statement: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
    sampleInput: "x = 2.00000, n = 10",
    sampleOutput: "1024.00000",
    testCases: [
      { input: "2.00000\n10", expectedOutput: "1024.00000" },
      { input: "2.10000\n3", expectedOutput: "9.26100" },
      { input: "2.00000\n-2", expectedOutput: "0.25000" }
    ],
    points: 150
  },
  {
    title: "Max Points on a Line",
    difficulty: "Hard",
    statement: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.",
    sampleInput: "points = [[1,1],[2,2],[3,3]]",
    sampleOutput: "3",
    testCases: [
      { input: "[[1,1],[2,2],[3,3]]", expectedOutput: "3" },
      { input: "[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]", expectedOutput: "4" }
    ],
    points: 200
  },

  // ─────────────────── 1D DYNAMIC PROGRAMMING (5) ───────────────────
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    statement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    sampleInput: "n = 2",
    sampleOutput: "2",
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" }
    ],
    points: 100
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    statement: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    sampleInput: "nums = [1,2,3,1]",
    sampleOutput: "4",
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "4" },
      { input: "[2,7,9,3,1]", expectedOutput: "12" }
    ],
    points: 150
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    statement: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    sampleInput: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
    sampleOutput: "true",
    testCases: [
      { input: "leetcode\n[\"leet\",\"code\"]", expectedOutput: "true" },
      { input: "applepenapple\n[\"apple\",\"pen\"]", expectedOutput: "true" },
      { input: "catsandog\n[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", expectedOutput: "false" }
    ],
    points: 150
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    statement: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    sampleInput: "coins = [1,2,5], amount = 11",
    sampleOutput: "3",
    testCases: [
      { input: "[1,2,5]\n11", expectedOutput: "3" },
      { input: "[2]\n3", expectedOutput: "-1" },
      { input: "[1]\n0", expectedOutput: "0" }
    ],
    points: 150
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    statement: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    sampleInput: "nums = [10,9,2,5,3,7,101,18]",
    sampleOutput: "4",
    testCases: [
      { input: "[10,9,2,5,3,7,101,18]", expectedOutput: "4" },
      { input: "[0,1,0,3,2,3]", expectedOutput: "4" },
      { input: "[7,7,7,7,7,7,7]", expectedOutput: "1" }
    ],
    points: 150
  },

  // ─────────────────── MULTIDIMENSIONAL DP (9) ───────────────────
  {
    title: "Triangle",
    difficulty: "Medium",
    statement: "Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below.",
    sampleInput: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]",
    sampleOutput: "11",
    testCases: [
      { input: "[[2],[3,4],[6,5,7],[4,1,8,3]]", expectedOutput: "11" },
      { input: "[[-10]]", expectedOutput: "-10" }
    ],
    points: 150
  },
  {
    title: "Minimum Path Sum",
    difficulty: "Medium",
    statement: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.",
    sampleInput: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
    sampleOutput: "7",
    testCases: [
      { input: "[[1,3,1],[1,5,1],[4,2,1]]", expectedOutput: "7" },
      { input: "[[1,2,3],[4,5,6]]", expectedOutput: "12" }
    ],
    points: 150
  },
  {
    title: "Unique Paths II",
    difficulty: "Medium",
    statement: "You are given an m x n integer array grid. There is a robot initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. An obstacle and space are marked as 1 or 0 respectively. Return the number of possible unique paths.",
    sampleInput: "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]",
    sampleOutput: "2",
    testCases: [
      { input: "[[0,0,0],[0,1,0],[0,0,0]]", expectedOutput: "2" },
      { input: "[[0,1],[0,0]]", expectedOutput: "1" }
    ],
    points: 150
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    statement: "Given a string s, return the longest palindromic substring in s.",
    sampleInput: "s = \"babad\"",
    sampleOutput: "bab",
    testCases: [
      { input: "babad", expectedOutput: "bab" },
      { input: "cbbd", expectedOutput: "bb" }
    ],
    points: 150
  },
  {
    title: "Interleaving String",
    difficulty: "Medium",
    statement: "Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2. An interleaving of two strings s and t is a configuration where s and t are divided into n and m substrings respectively and interleaved.",
    sampleInput: "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"",
    sampleOutput: "true",
    testCases: [
      { input: "aabcc\ndbbca\naadbbcbcac", expectedOutput: "true" },
      { input: "aabcc\ndbbca\naadbbbaccc", expectedOutput: "false" },
      { input: "\n\n", expectedOutput: "true" }
    ],
    points: 150
  },
  {
    title: "Edit Distance",
    difficulty: "Medium",
    statement: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations: Insert a character, Delete a character, Replace a character.",
    sampleInput: "word1 = \"horse\", word2 = \"ros\"",
    sampleOutput: "3",
    testCases: [
      { input: "horse\nros", expectedOutput: "3" },
      { input: "intention\nexecution", expectedOutput: "5" }
    ],
    points: 150
  },
  {
    title: "Best Time to Buy and Sell Stock III",
    difficulty: "Hard",
    statement: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete at most two transactions.",
    sampleInput: "prices = [3,3,5,0,0,3,1,4]",
    sampleOutput: "6",
    testCases: [
      { input: "[3,3,5,0,0,3,1,4]", expectedOutput: "6" },
      { input: "[1,2,3,4,5]", expectedOutput: "4" },
      { input: "[7,6,4,3,1]", expectedOutput: "0" }
    ],
    points: 200
  },
  {
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "Hard",
    statement: "You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k. Find the maximum profit you can achieve. You may complete at most k transactions.",
    sampleInput: "k = 2, prices = [2,4,1]",
    sampleOutput: "2",
    testCases: [
      { input: "2\n[2,4,1]", expectedOutput: "2" },
      { input: "2\n[3,2,6,5,0,3]", expectedOutput: "7" }
    ],
    points: 200
  },
  {
    title: "Maximal Square",
    difficulty: "Medium",
    statement: "Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.",
    sampleInput: "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
    sampleOutput: "4",
    testCases: [
      { input: "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", expectedOutput: "4" },
      { input: "[[\"0\",\"1\"],[\"1\",\"0\"]]", expectedOutput: "1" },
      { input: "[[\"0\"]]", expectedOutput: "0" }
    ],
    points: 150
  }
];

export default interviewQuestions;
