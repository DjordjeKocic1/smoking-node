import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoriesShema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Categorie", categoriesShema);
