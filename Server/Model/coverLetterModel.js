import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ["formal", "confident", "friendly"],
      default: "formal",
    },
    coverLetterText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CoverLetter", coverLetterSchema);
