import mongoose from "mongoose";

const multiplayerRoomSchema = new mongoose.Schema(
  {
    host: {
      type: String,
      required: true
    },

    players: {
      type: [String],
      default: []
    },

    /*
    Stored as plain objects (title, _id, difficulty etc.)
    so we don't need a separate population step in BattleRoom
    */
    selectedProblems: {
      type: [Object],
      default: []
    },

    status: {
      type: String,
      enum: ["waiting", "started", "finished"],
      default: "waiting"
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

/*
Index so waiting-room queries are fast
*/
multiplayerRoomSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("MultiplayerRoom", multiplayerRoomSchema);
