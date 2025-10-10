import Problem from "../models/Problem.js";
import User from "../models/User.js";

// Get all problems with addedBy user details, sorted newest first
export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single problem by ID with addedBy user details
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "addedBy",
      "name email"
    );
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new problem, only admins allowed
export const addProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    // Check user role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add problems" });
    }

    // Validate required fields
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "At least one test case required" });
    }
    for (let i = 0; i < testCases.length; i++) {
      if (!testCases[i].input || !testCases[i].output) {
        return res.status(400).json({ message: `Test case ${i + 1} must have input and output` });
      }
    }

    // Create new problem
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      addedBy: req.user._id,
      testCases,
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
