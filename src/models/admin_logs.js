import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the admin performing the action
    required: true,
  },
  action: {
    type: String, // Description of the action performed
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminLogs = mongoose.model("AdminLog", logSchema);
export default AdminLogs;
