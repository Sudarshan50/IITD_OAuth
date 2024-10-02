import crypto from "crypto";
import { redisClient } from "../lib/redis.js";

export async function generateAuthorizationCode(clientId, userId) {
  const code = crypto.randomBytes(20).toString("base64url");
  const authCodeData = {
    clientId,
    userId,
  };

  await redisClient.set(
    `auth_code:${code}`,
    JSON.stringify(authCodeData),
    "EX",
    1200  // TODO: Set the expiration time to 1 minutes
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
  await redisClient.del(`auth_code:${code}`); // 60 seconds expiration
  return authCodeData;
}
