import crypto from "crypto";

import authorization_code from "../models/authorization_code.js";

export async function generateAuthorizationCode(clientId, userId) {
  const code = crypto.randomBytes(20).toString("hex");
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); //expiry time 2min....
  const authCode = new authorization_code({
    code,
    clientId,
    userId,
    expiresAt,
  });

  await authCode.save();
  return code;
}

export async function useAuthorizationCode(code) {
  const authCode = await authorization_code.findOne({ code, used: false });

  if (!authCode || new Date() > authCode.expiresAt) {
    throw new Error("Invalid or expired authorization code");
  }

  authCode.used = true;
  await authCode.save();
  return authCode;
}
