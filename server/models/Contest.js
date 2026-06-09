import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Contest", contestSchema);
