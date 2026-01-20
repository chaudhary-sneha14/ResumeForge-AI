import { v2 as cloudinary } from "cloudinary";
import Resume from "../Model/resumeModel.js";

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
    return res.status(200).json({ message: "Resume deleted Succesfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
