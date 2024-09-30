import AdminLogs from "../models/admin_logs.js";

export const logAdminAction = async (
  adminId,
  action,
  message = "No message provided",
) => {
  try {
    const log = new AdminLogs({
      adminId,
      action,
      message,
    });

    await log.save();
  } catch (err) {
    console.error("Error logging admin action:", err.message);
  }
};
