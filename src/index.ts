import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import connectDb from "./utils/db";
import { userRouter } from "./routes/user.route";
import { config } from "./config/config";
import ErrorHandler from "./middlewares/ErrorHandler";

dotenv.config();

const port = process.env.PORT;
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  connectDb();
});
