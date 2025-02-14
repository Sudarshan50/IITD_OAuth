// models/User.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import oauth_client from "./oauth_client.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  kerberosId: { type: String, required: true, unique: true },
  password: { type: String },
  allowedPasswordLogin: { type: Boolean, default: false },
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


userSchema.pre('save', async function (next) {
  if ((this.isModified('password') || this.isNew) && this.password) {

    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return this.password && typeof this.password == "string" && await bcrypt.compare(password, this.password);
  } catch {
    return false;
  }
};

userSchema.methods.updatePassword = async function (newPassword) {
  this.password = newPassword;
  await this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
