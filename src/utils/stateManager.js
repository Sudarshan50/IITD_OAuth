import crypto from "crypto";
import { redisClient } from "../lib/redis.js";
import { error } from "console";

// Helper function to Base64 URL encode a buffer
function base64URLEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
    .replace(/=+$/, ""); // Remove padding characters (=)
}

// Generate State Parameter using Base64 URL encoding
export async function generateStateParameter() {
  const state = base64URLEncode(crypto.randomBytes(20)); 

  await redisClient.set(`state:${state}`, "true", "EX", 120); 
  return state;
}

export async function validateStateParameter(state) {
  const exists = await redisClient.exists(`state:${state}`);

  if (!exists) {
    throw new Error("Invalid or expired state parameter",error);
  }

  await redisClient.expire(`state:${state}`, 60); 

  return true; // State is valid
}
