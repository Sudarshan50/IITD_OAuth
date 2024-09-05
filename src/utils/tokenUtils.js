// utils/tokenUtils.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate Access and Refresh Tokens
export function generateTokens(user, client) {
  const payload = {
    sub: user._id,
    kerberos:user.kerberosId,
    user_name:user.username,
    email:user.email,
    aud: client.clientId, // Audience (client ID)
    jti: crypto.randomUUID(), // Unique identifier for the token
    ssi: new Date().getTime(), // Some secure state identifier
  };

  const accessToken = jwt.sign(payload, client.encryptedprivateKey, {
    algorithm: "RS256",
    expiresIn: "15m", // Access Token expiry
  });

  const refreshToken = jwt.sign(payload, client.encryptedprivateKey, {
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
