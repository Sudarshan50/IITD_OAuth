import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  lastLogin: {
    timeStamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
    },
    serviceUsed: {
      type: String,
      required: true,
    },
  },
});

logSchema.virtual("oauthClient", {
  ref: "OAuthClient",
  localField: "lastLogin.serviceUsed",
  foreignField: "client_id",
  justOne: true,
});

logSchema.set("toObject", { virtuals: true });
logSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Log", logSchema);
