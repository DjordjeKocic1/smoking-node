import { IAchievement } from "../types/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const achievementShema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: String,
  categorie: String,
  points: String,
  type:String,
});

export default mongoose.model<IAchievement>("Achievement", achievementShema);
