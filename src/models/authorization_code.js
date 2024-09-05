import mongoose from "mongoose";

const authorizationCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

authorizationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AuthorizationCode", authorizationCodeSchema);
