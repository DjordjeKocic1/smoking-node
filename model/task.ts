import { ITask } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  toDo: String,
  done: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "Mentor",
    req: true,
  },
});

export default mongoose.model<ITask>("Task", taskSchema);
