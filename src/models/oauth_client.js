import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const oauthClientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientSecretHash: { type: String, required: true },
  redirectUri: { type: [String], required: true },
  public_key: { type: String, required: true },
  encryptedprivateKey: { type: String, default: true },
  scope: { type: [String], default: ["read"], required: false },
  createdAt: { type: Date, default: Date.now },
});

oauthClientSchema.pre("save", async function (next) {
  if (this.isModified("clientSecretHash")) {
    this.clientSecretHash = await bcrypt.hash(this.clientSecretHash, 12);
  }
  next();
});

export default mongoose.model("OAuthClient", oauthClientSchema);
