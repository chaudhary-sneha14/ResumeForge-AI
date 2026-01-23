import express from "express";

import auth from "../Middleware/auth.js";
import { enhanceJobDescription, enhanceProfessionalSummary, generateInterviewQuestions, keywordGapAnalyzer, tailorResumeToJob, uploadResume } from "../Controller/aiController.js";
import { generateCoverLetter, generateSkillGap, generateSkillGapPlan, getSkillGaps, updateSkillStatus } from "../Controller/ai2Controller.js";
// import { getProgressHistory, saveProgress } from "../Controller/progrees.js";



const aiRoutes = express.Router();

// Text enhancement
aiRoutes.post("/enhance-summary", auth, enhanceProfessionalSummary);
aiRoutes.post("/enhance-job-desc", auth, enhanceJobDescription);

// Resume upload + parsing
aiRoutes.post("/upload-resume", auth, uploadResume);

// Job-specific tailoring
aiRoutes.post("/tailor/:resumeId", auth, tailorResumeToJob);

// ATS keyword analysis
aiRoutes.post("/keyword-gap/:resumeId", auth, keywordGapAnalyzer);

// Interview questions
aiRoutes.post("/interview/:resumeId", auth, generateInterviewQuestions);

// ✅ Cover letter generation
aiRoutes.post("/cover-letter", auth, generateCoverLetter);

// ✅ Skill gap planner
aiRoutes.post("/generate", auth, generateSkillGap);

aiRoutes.post("/generate-plan",auth,generateSkillGapPlan);

aiRoutes.get("/",auth,getSkillGaps);

aiRoutes.patch("/:id",auth,updateSkillStatus);

// // Progress tracking
// aiRoutes.post("/progress/save", auth, saveProgress);
// aiRoutes.get("/progress/history", auth, getProgressHistory);


export default aiRoutes;
