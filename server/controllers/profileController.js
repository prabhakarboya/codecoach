import User from "../models/User.js";
import Submission from "../models/Submission.js";

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update current user's profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, preferences } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (preferences) user.preferences = preferences;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's progress (e.g. problems solved and scores)
export const getProgress = async (req, res) => {
  try {
    const progressAggregation = await Submission.aggregate([
      { $match: { user: req.user._id, status: "Passed" } },
      {
        $group: {
          _id: null,
          solvedProblems: { $sum: 1 },
          totalScore: { $sum: "$score" },
        },
      },
    ]);

    const progress = progressAggregation[0] || { solvedProblems: 0, totalScore: 0 };
    res.json({ solvedProblems: progress.solvedProblems, score: progress.totalScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
