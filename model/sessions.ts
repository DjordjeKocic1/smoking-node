import { ISession } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  type: { type: String, enum: ["verificationRequest", "deleteRequest","loginRequest"] },
  expireAt: {
    type: Date,
  },
  userId: String,
  email: String,
  token: String,
});
export default mongoose.model<ISession>("Sessions", sessionSchema);
