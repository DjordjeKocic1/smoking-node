import { INotificaion } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  isMentoring: Boolean,
  isTask:Boolean,
  isRead: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
});

export default mongoose.model<INotificaion>("Notification", notificationSchema);
