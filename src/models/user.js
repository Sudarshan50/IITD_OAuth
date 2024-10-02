// models/User.js
import mongoose from "mongoose";
import oauth_client from "./oauth_client.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  kerberosId: { type: String, required: true, unique: true },
  msId: { type: String, required: true, unique: true },
  hostel: { type: String },
  dateOfBirth: { type: Date },
  instagramId: { type: String },
  mobileNo: { type: String },
  completedOnboarding: { type: Boolean, default: false },
  authorizedClients: {
    type: Array,
    ref: oauth_client,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
