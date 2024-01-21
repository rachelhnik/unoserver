import express from "express";
import { createUser } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/", createUser);
