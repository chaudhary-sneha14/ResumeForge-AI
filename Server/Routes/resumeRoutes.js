import express from "express"
import upload from "../Config/multer.js";
import auth from "../Middleware/auth.js";
import { createResume, deleteResume, getDashboardSummary, getPublicResumeById, getResumeById, updateResume } from "../Controller/resumeController.js";


const resumeRouter=express.Router()

resumeRouter.post('/create',auth,createResume);
resumeRouter.put('/update',upload.single('image'),auth,updateResume)
resumeRouter.delete('/delete/:resumeId',auth,deleteResume)
resumeRouter.get('/get/:resumeId',auth,getResumeById)
resumeRouter.get('/public/:resumeId',getPublicResumeById)
resumeRouter.get("/summary", auth, getDashboardSummary);

export default resumeRouter
