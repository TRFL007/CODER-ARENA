import mongoose from "mongoose";

const ContestScoreSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },

    contestId: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      default: 0
    },

    problemsSolved: {
      type: Number,
      default: 0
    },

    submissionCount: {
      type: Number,
      default: 0
    },

    penalty: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

/*
Compound unique index so upsert works correctly
*/
ContestScoreSchema.index({ username: 1, contestId: 1 }, { unique: true });

export default mongoose.model("ContestScore", ContestScoreSchema);
