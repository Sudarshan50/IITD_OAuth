import e from "cors";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ownedClients: [
    {
      type: String,
      ref: "OAuthClient", // Assuming the OAuth client schema is named "OAuthClient"
      foreignField: "clientId", // Referencing the clientId field in the OAuth client schema
      localField: "ownedClients", // Local field in the admin schema
    },
  ],
  permission_code: {
    type: String,
    enum: ["admin", "superadmin"],
    default: "admin",
    required: true,
  },
});
export default mongoose.model("Admin", adminSchema);
