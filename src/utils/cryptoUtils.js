import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const passphrase = process.env.KEY_PASSPHRASE; // Store this securely
// Function to decrypt an encrypted private key using the passphrase
export function decryptPrivateKey(encryptedKey) {
  try {
    const decryptedKey = crypto.privateDecrypt(
      {
        key: encryptedKey, // The encrypted private key as a PEM string
        passphrase: passphrase, // The passphrase used during key generation
      },
      Buffer.from(encryptedKey, "base64")
    );
    return decryptedKey.toString("utf8");
  } catch (error) {
    console.error("Error decrypting the private key:", error.message);
    return null;
  }
}

// Function to sign data with an RSA private key
export function signData(data, privateKey) {
  try {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(data);
    sign.end();
    const signature = sign.sign(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      "base64" // Signature output encoding
    );
    return signature;
  } catch (error) {
    console.error("Error signing the data:", error.message);
    return null;
  }
}

// Function to verify the signature of data using a public key
export function verifySignature(data, signature, publicKey) {
  try {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(data);
    verify.end();
    console.log(publicKey);
    const isVerified = verify.verify(publicKey, signature, "base64");
    return isVerified;
  } catch (error) {
    console.error("Error verifying the signature:", error.message);
    return false;
  }
}
