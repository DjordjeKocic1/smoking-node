const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  image: String,
  userVerified: Boolean,
  userBasicInfo: {
    address: String,
    city: String,
    country: String,
    flag: String,
  },
  smokingInfo: {
    cigarettesDay: String,
    packCigarettesPrice: String,
    cigarettesInPack: String,
    cigarettesAvoided: Number,
    cigarettesAvoidedCost: Number,
  },
  newSmokingInfo: {
    cigarettesDay: String,
    packCigarettesPrice: String,
    cigarettesInPack: String,
  },
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
