import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      //   required: true,
    },
    tokens: {
      type: Object,
    },
    historyId: {
      type: String,
    },
    watchExpiration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
