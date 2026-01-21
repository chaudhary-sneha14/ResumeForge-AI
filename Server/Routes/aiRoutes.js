import express from "express";

import auth from "../Middleware/auth.js";
import { enhanceJobDescription, enhanceProfessionalSummary, generateInterviewQuestions, keywordGapAnalyzer, tailorResumeToJob, uploadResume } from "../Controller/aiController.js";


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

export default aiRoutes;
