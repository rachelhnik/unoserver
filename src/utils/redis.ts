import { Redis } from "@upstash/redis";
import { config } from "../config/config";

if (!config.redisUrl || !config.redisToken) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

export const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});
