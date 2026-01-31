import express from "express";

import auth from "../Middleware/auth.js";
import { enhanceJobDescription, enhanceProfessionalSummary, generateInterviewQuestions, getMyResumes, keywordGapAnalyzer, tailorResumeToJob, uploadResume } from "../Controller/aiController.js";
import { deleteSkillGap, generateCoverLetter, generateSkillGap,  getSkillGaps, saveSkillGapPlan, updateSkillStatus } from "../Controller/ai2Controller.js";
import upload from "../Config/multer.js";
// import { getProgressHistory, saveProgress } from "../Controller/progrees.js";



const aiRoutes = express.Router();

// Text enhancement
aiRoutes.post("/enhance-summary", auth, enhanceProfessionalSummary);
aiRoutes.post("/enhance-job-desc", auth, enhanceJobDescription);

// Resume upload + parsing
aiRoutes.post("/upload-resume", auth,upload.single('resume'), uploadResume);
aiRoutes.get("/my-resumes", auth, getMyResumes);


// Job-specific tailoring
aiRoutes.post("/tailor/:resumeId", auth, tailorResumeToJob);

// ATS keyword analysis
aiRoutes.post("/keyword-gap/:resumeId", auth, keywordGapAnalyzer);

// Interview questions
aiRoutes.post("/interview/:resumeId", auth, generateInterviewQuestions);

// ✅ Cover letter generation
aiRoutes.post("/cover-letter", auth, generateCoverLetter);

// ✅ Skill gap planner
aiRoutes.post("/skill-gap", auth, generateSkillGap);

aiRoutes.post("/save",auth,saveSkillGapPlan);

aiRoutes.get("/skill-progress",auth,getSkillGaps);

aiRoutes.patch("/skill-gap/:id",auth,updateSkillStatus);
// routes/skillGapRoutes.js

aiRoutes.delete("/skill-gap/:id",auth,deleteSkillGap);



// // Progress tracking
// aiRoutes.post("/progress/save", auth, saveProgress);
// aiRoutes.get("/progress/history", auth, getProgressHistory);


export default aiRoutes;
