import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
    },

    // Cloudinary URL
    fileUrl: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      default: null,
    },

    atsUpdatedAt: {
      type: Date,
      default: null,
    },

    // ---------- Parsed / AI fields (used later) ----------
    professional_summary: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    experience: [
      {
        company: String,
        position: String,
        start_date: String,
        end_date: String,
        description: String,
        is_current: {
          type: Boolean,
          default: false,
        },
      },
    ],

    projects: [
      {
        name: String,
        type: String,
        description: String,
        link: { type: String, default: "" },
      },
    ],

    achievements: [
      {
        name: String,
        description: String,
        link: { type: String, default: "" },
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduation_date: String,
        gpa: String,
      },
    ],

    // ---------- Future ----------
    rawText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
