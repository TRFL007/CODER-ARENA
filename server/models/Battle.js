import mongoose from "mongoose";

const battleSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true
    },

    host: {
      type: String,
      required: true
    },

    players: [
      {
        username: String
      }
    ],

    status: {
      type: String,
      default: "waiting"
    },

    selectedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
      }
    ],

    progress: {
      type: Object,
      default: {}
    },

    feed: {
      type: [String],
      default: []
    },

    winner: {
      type: String,
      default: ""
    },

    battleTime: {
      type: Number,
      default: 300
    },

    startedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Battle", battleSchema);
