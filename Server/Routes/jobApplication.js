import express from 'express'
import auth from '../Middleware/auth.js';
import { addJob, getJobs, updateJobStatus } from '../Controller/progrees.js';

const jobRoutes=express.Router()

jobRoutes.post("/add-job", auth, addJob);
jobRoutes.get("/get-jobs", auth, getJobs);
jobRoutes.patch("/job/:id",auth, updateJobStatus);

export default jobRoutes;