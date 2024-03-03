import { ISession, ITask } from "../types/types";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  expireAt: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 30),
  },
  userId: String,
  email: String,
});
export default mongoose.model<ISession>("Sessions", sessionSchema);
