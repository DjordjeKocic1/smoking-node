import { IMentor } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  name: String,
  email: String,
  accepted: Boolean,
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
  mentoringUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
  mentoringUser: [
    {
      name: String,
      email: {
        type: String,
        req: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        req: true,
      },
    },
  ],
});

export default mongoose.model<IMentor>("Mentor", mentorSchema);
