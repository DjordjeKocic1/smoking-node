import { IFeedBack, ITask } from "../types/types";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  email: String,
  message: String,
});

export default mongoose.model<IFeedBack>("Feedback", feedbackSchema);
