import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    description: String,
    isOfficial: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

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

    testCases: [testCaseSchema],

    points: {
      type: Number,
      default: 2
    },

    isInterviewQuestion: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to automatically set points based on difficulty
problemSchema.pre("save", function (next) {
  const difficultyScores = {
    Easy: 2,
    Medium: 3,
    Hard: 5
  };

  if (this.isNew || this.isModified("difficulty")) {
    this.points = difficultyScores[this.difficulty] || 2;
  }

  next();
});

// Static method to get score for a difficulty level
problemSchema.statics.getScoreForDifficulty = function (difficulty) {
  const scores = {
    Easy: 2,
    Medium: 3,
    Hard: 5
  };
  return scores[difficulty] || 2;
};

export default mongoose.model("Problem", problemSchema);
