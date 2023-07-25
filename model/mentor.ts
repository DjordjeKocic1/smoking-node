import { IMentor } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  name: String,
  email: String,
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
  mentoringUser: [
    {
      name: String,
      accepted: {
        type: Boolean,
        default: false,
      },
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
