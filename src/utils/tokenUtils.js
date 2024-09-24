// utils/tokenUtils.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { decryption } from "../config/key.js";

// Generate Access and Refresh Tokens
export function generateTokens(user, client) {
  const payload = {
    sub: user._id,
    kerberos: user.kerberosId,
    user_name: user.username,
    email: user.email,
    aud: client.clientId, // Audience (client ID)
    jti: crypto.randomUUID(), // Unique identifier for the token
    ssi: new Date().getTime(), // Some secure state identifier
  };
  const decipher = decryption(
    client.encryptedprivateKey,
    client.clientSecretHash
  );

  const accessToken = jwt.sign(payload, decipher, {
    algorithm: "RS256",
    expiresIn: "15m", // Access Token expiry
  });

  const refreshToken = jwt.sign(payload, decipher, {
    algorithm: "RS256",
    expiresIn: "7d", // Refresh Token expiry
  });

  return { accessToken, refreshToken };
}

// Verify JWT with the client's public key
export function verifyToken(token, publicKey) {
  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

//geneate acessToken via refresh token...
export function generateAccessToken(refreshToken, client) {
  const decipher = decryption(
    client.encryptedprivateKey,
    client.clientSecretHash
  );
  const payload = verifyToken(refreshToken, process.env.CLIENT_PUBLIC_KEY);
  payload.exp = Math.floor(Date.now() / 1000) + 60 * 15;
  if (!payload) {
    return null;
  }
  const accessToken = jwt.sign(payload, decipher, {
    algorithm: "RS256",
  });
  return accessToken;
}
