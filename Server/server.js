import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";
import "dotenv/config";
import userRouter from "./Routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
