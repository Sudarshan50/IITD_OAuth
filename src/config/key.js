import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

const encryption = (hash_client_secret, privateKey) => {
  try {
    const encryptedKey = crypto
      .createHash("sha256")
      .update(hash_client_secret)
      .digest();

    console.log("encryptedKey", encryptedKey);
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");
    if (iv.length !== 16) {
      throw new Error("Invalid IV: It must be 16 bytes long.");
    }
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptedKey, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  } catch (err) {
    throw new Error("Encryption error:", err.message);
  }
};

const decryption = (encryptedPrivateKey, hash_client_secret) => {
  try {
    const decryptionKey = crypto
      .createHash("sha256")
      .update(hash_client_secret)
      .digest();
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");
    if (iv.length !== 16) {
      throw new Error("Invalid IV: It must be 16 bytes long.");
    }
    const decipher = crypto.createDecipheriv("aes-256-cbc", decryptionKey, iv);
    let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err.message);
    throw new Error("Decryption error:", err.message);
  }
};

export { publicKey, privateKey, encryption, decryption };
