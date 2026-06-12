import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Problem"
    },

    username: {
      type: String,
      default: "Anonymous"
    },

    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

discussionSchema.index({ problemId: 1, createdAt: -1 });

export default mongoose.model("Discussion", discussionSchema);
