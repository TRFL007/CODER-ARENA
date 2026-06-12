import mongoose from "mongoose";

const testCaseSubmissionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending_validation", "validated", "rejected"],
      default: "pending_validation"
    },
    validationResult: {
      isValid: Boolean,
      message: String,
      groqAnalysis: String,
      validatedAt: Date
    },
    rejectionReason: String,
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("TestCaseSubmission", testCaseSubmissionSchema);
