const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  image: String,
  address: String,
  city: String,
  smokingInfo: {
    cigarettes: String,
    packCigarettesPrice: String,
    cigarettesInPack: String,
  },
  userVerified: Boolean,
  categories: [
    {
      categorieId: {
        type: Schema.Types.ObjectId,
        ref: "Categorie",
        req: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userShema);
