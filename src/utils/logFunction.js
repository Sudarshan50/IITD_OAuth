import Log from "../models/log.js"
/*
 * Log user actions (login/logout) to the MongoDB database without storing IP address.
 * @param {string} userId - The ID of the user.
 * @param {string} serviceUsed - The OAuth client or service used.
 * @param {string} action - The action performed (login or logout).
 * @returns {Promise<void>} - A promise that resolves when the log is saved.
 */
export async function logUserAction(userId, serviceUsed, message) {
  const newLog = new Log({
    userId,
    lastLogin: {
      serviceUsed,
      message,
    },
  });

  try {
    await newLog.save(); // Save log to the database..
  } catch (error) {
    console.error("Error saving log:", error);
  }
}
