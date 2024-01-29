import { IPlans } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const plansShema = new Schema({
  name: {
    type: String,
    require: true,
  },
  completed: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
});

export default mongoose.model<IPlans>("Plans", plansShema);
