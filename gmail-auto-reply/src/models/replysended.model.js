import mongoose from "mongoose";

const replySendedSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
    },
    originalMessageId: {
      type: String,
      required: true,
    },
    historyId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ReplySended = mongoose.model("ReplySended", replySendedSchema);
