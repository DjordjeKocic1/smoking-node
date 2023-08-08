import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  toDo: String,
  status: String,
  comment: String,
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

export default mongoose.model("Task", taskSchema);
