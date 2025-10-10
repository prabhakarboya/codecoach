import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter problem title"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // references the User model for the admin
      required: true,
    },
    testCases: [testCaseSchema], // array of test case subdocuments
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
