import express from "express";
import { createUser, getUser, updateUser } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/", createUser);
userRouter.put("/", updateUser);
