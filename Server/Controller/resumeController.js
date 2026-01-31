import { v2 as cloudinary } from "cloudinary";
import Resume from "../Model/resumeModel.js";
import SkillGapModel from "../Model/SkillGapModel.js";
import coverLetterModel from "../Model/coverLetterModel.js";
import JobApplication from "../Model/JobApplication.js";

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    const newResume = await Resume.create({ userId, title });
    res
      .status(201)
      .json({ message: "Resume created Succesfully", resume: newResume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//controller for deleting resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({ success:true,message: "Resume deleted Succesfully" });
  } catch (error) {
    return res.status(500).json({success:false, message: error.message });
  }
};

//get resume by id public

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData } = req.body;
    const image = req.file;

    let resumeDataCopy;

    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Cloudinary upload
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "user-resumes",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" },
        ],
      });

      resumeDataCopy.personal_info.image = result.secure_url;
      fs.unlinkSync(image.path); // delete temp file
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true },
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Saved Successfully", resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//--------------Dash Board ---------------


export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // ---------------- BASIC COUNTS ----------------
    const resumes = await Resume.find({ userId }).sort({
      createdAt: -1,
    });

    const resumeCount = resumes.length;

    const skillGapCount = await SkillGapModel.countDocuments({
      userId,
    });

    const coverLetterCount = await coverLetterModel.countDocuments({
     userId,
    });

    const jobApplicationCount = await JobApplication.countDocuments({
       userId,
    });

    // ---------------- ATS INSIGHTS ----------------
  const atsResumes = resumes.filter(
  r => typeof r.atsScore === "number" && !isNaN(r.atsScore)
);

const avgAtsScore =
  atsResumes.length > 0
    ? Math.round(
        atsResumes.reduce(
          (sum, r) => sum + r.atsScore,
          0
        ) / atsResumes.length
      )
    : null;
console.log("ATS scores:", resumes.map(r => r.atsScore));


    const bestResume =
      atsResumes.length > 0
        ? atsResumes.reduce((best, r) =>
            r.atsScore > best.atsScore ? r : best
          )
        : null;

    const atsDistribution = {
      weak: atsResumes.filter(r => r.atsScore < 60).length,
      average: atsResumes.filter(
        r => r.atsScore >= 60 && r.atsScore < 75
      ).length,
      strong: atsResumes.filter(r => r.atsScore >= 75).length,
    };

    // ---------------- RECENT ACTIVITY ----------------
    const recentResumes = resumes.slice(0, 3).map(r => ({
      type: "Resume Uploaded",
      date: r.createdAt,
    }));

    const recentSkillGaps = (
      await SkillGapModel.find({  userId })
        .sort({ createdAt: -1 })
        .limit(2)
    ).map(s => ({
      type: "Skill Gap Generated",
      date: s.createdAt,
    }));

    const recentCoverLetters = (
      await coverLetterModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(2)
    ).map(c => ({
      type: "Cover Letter Generated",
      date: c.createdAt,
    }));

    const recentActivity = [
      ...recentResumes,
      ...recentSkillGaps,
      ...recentCoverLetters,
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        counts: {
          resumeCount,
          skillGapCount,
          coverLetterCount,
          jobApplicationCount,
        },
        ats: {
          avgAtsScore,
          bestResume: bestResume
            ? {
                resumeId: bestResume._id,
                atsScore: bestResume.atsScore,
              }
            : null,
          distribution: atsDistribution,
        },
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
