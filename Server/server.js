import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";
// import "dotenv/config";
import userRouter from "./Routes/userRoutes.js";
import resumeRouter from "./Routes/resumeRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import jobRoutes from "./Routes/jobApplication.js";





const app = express();


app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRoutes)
app.use("/api/progress",jobRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
