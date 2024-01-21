import dotenv from "dotenv";
dotenv.config();

interface Config {
  mongoUri: string;
  origin: string;
  redisUrl: string;
  redisToken: string;
}

export const config: Config = {
  mongoUri: process.env.MONGO_URI || "",
  origin: process.env.ORIGIN || "",
  redisUrl: process.env.UPSTASH_REDIS_REST_URL || "",
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",
};
