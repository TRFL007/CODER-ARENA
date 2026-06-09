import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"]
    },

    statement: {
      type: String,
      required: true
    },

    sampleInput: String,

    sampleOutput: String,

    testCases: [
      {
        input: String,
        /*
        BUG FIX: was only "expectedOutput" but codeRoutes
        now supports both via the ?? fallback.
        Keep `expectedOutput` as canonical name here.
        */
        expectedOutput: String
      }
    ],

    points: {
      type: Number,
      default: 100
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Problem", problemSchema);
