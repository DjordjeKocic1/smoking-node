import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mentorSchema = new Schema({
    name:String,
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        notes:String
    }
})

export default mongoose.model("Mentor", mentorSchema);