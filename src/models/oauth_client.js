import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const oauthClientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  clientName: { type: String, required: true, unique: true },
  clientSecretHash: { type: String, required: true },
  redirectUri: { type: [String], required: true },
  grants: { type: [String], default: ["authorization_code"], required: true },
  scope: { type: [String], default: ["read"], required: false },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
});

oauthClientSchema.pre("save", async function (next) {
  if (this.isModified("clientSecretHash")) {
    this.clientSecretHash = await bcrypt.hash(this.clientSecretHash, 12);
  }
  next();
});

export default mongoose.model("OAuthClient", oauthClientSchema);
