import { IMentor } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  name: String,
  email: String,
  accepted: Boolean,
  mentoringUser: [
    {
      name: String,
      email: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        req: true,
      },
    },
  ],
});

export default mongoose.model<IMentor>("Mentor", mentorSchema);
