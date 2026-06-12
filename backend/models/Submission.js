import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    verdict: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Submission", submissionSchema);
