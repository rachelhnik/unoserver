import express from "express";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route";
import { config } from "./config/config";
import ErrorHandler from "./middlewares/ErrorHandler";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);

app.use(ErrorHandler);

export default app;
