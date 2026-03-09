import mongoose from "mongoose";
import crypto from "crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const POLL_ID_LENGTH = 6;

const createPollId = () => {
  const bytes = crypto.randomBytes(POLL_ID_LENGTH);
  let id = "";

  for (let i = 0; i < POLL_ID_LENGTH; i += 1) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }

  return id;
};

const pollSchema = new mongoose.Schema(
{
  _id: {
    type: String,
    default: () => createPollId()
  },

  question: {
    type: String,
    required: true
  },

  options: {
    type: [String],
    required: true
  },

  userId: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  },

  closedAt: {
    type: Date,
    default: null
  }
},
{ timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Poll", pollSchema);
