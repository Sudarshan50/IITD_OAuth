import crypto from "crypto";
import { redisClient } from "../lib/redis.js";

// Helper function to Base64 URL encode a buffer
function base64URLEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
    .replace(/=+$/, ""); // Remove padding characters (=)
}

// Generate Authorization Code using Base64 URL encoding
export async function generateAuthorizationCode(clientId, userId) {
  const code = base64URLEncode(crypto.randomBytes(20)); // 20-byte random string Base64 URL encoded

  const authCodeData = {
    clientId,
    userId,
  };

  await redisClient.set(
    `auth_code:${code}`,
    JSON.stringify(authCodeData),
    "EX",
    1200,
  );
  return code;
}

export async function useAuthorizationCode(code) {
  // Get the authorization code details from Redis
  const authCodeDataString = await redisClient.get(`auth_code:${code}`);

  if (!authCodeDataString) {
    throw new Error("Invalid or expired authorization code");
  }
  const authCodeData = JSON.parse(authCodeDataString);

  //shorten the life of code...
  await redisClient.expire(`auth_code:${code}`, 60); // 60 seconds expiration
  return authCodeData;
}
