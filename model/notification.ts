import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: String,
  toEmail: String,
  isMentoring: Boolean,
  isAchievement: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
});

export default mongoose.model("Notification", notificationSchema);
