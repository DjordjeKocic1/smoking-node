import { IPlans, UserTypes } from "../types/types";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const plansShema = new Schema({
  name: {
    type: String,
    require: true,
  },
  userType: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
});

export default mongoose.model<IPlans>("Plans", plansShema);
