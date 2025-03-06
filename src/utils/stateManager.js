import { error } from "console";
import crypto from "crypto";
import { redisClient } from "../lib/redis.js";

// Generate State Parameter using Base64 URL encoding
export async function generateStateParameter() {
  const state = (crypto.randomBytes(20)).toString("hex");

  await redisClient.set(`state:${state}`, "true", "EX", 60);
  return state;
}

export async function validateStateParameter(state) {
  const exists = await redisClient.exists(`state:${state}`);

  if (!exists) {
    throw new Error("Invalid or expired state parameter", error);
  }

  await redisClient.del(`state:${state}`);

  return true; // State is valid
}
