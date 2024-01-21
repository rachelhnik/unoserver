import dotenv from "dotenv";
dotenv.config();

interface Config {
  mongoUri: string;
  origin: string;
}

export const config: Config = {
  mongoUri: process.env.MONGO_URI || "",
  origin: process.env.ORIGIN || "",
};
