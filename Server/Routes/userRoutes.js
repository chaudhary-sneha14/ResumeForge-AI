import express from "express";
import { getUser, login, register } from "../Controller/userController.js";
import auth from "../Middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/get",auth,getUser);

export default userRouter;
