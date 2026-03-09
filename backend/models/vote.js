import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
{
  pollId: {
    type: String,
    ref: "Poll",
    required: true
  },

  option: {
    type: String,
    required: true
  },

  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  }
},
{ timestamps: { createdAt: "timestamp", updatedAt: false } }
);

export default mongoose.model("Vote", voteSchema);