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
    cigarettesDay: Number,
    packCigarettesPrice: Number,
    cigarettesInPack: Number,
    cigarettesAvoided: {
      type: Number,
      default: 0,
    },
    cigarettesDailyCost: Number,
    cigarettesMontlyCost: Number,
    cigarettesYearlyCost: Number,
    cigarettesAvoidedCost: {
      type: Number,
      default: 0,
    },
    cigarettesAvoidedOldCost: Number,
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

userShema.methods.calculateCosts = function (req) {
  this.smokingInfo.cigarettesAvoided = req.cigarettesAvoided;

  if (req.packCigarettesPrice || req.cigarettesInPack || req.cigarettesDay) {
    this.smokingInfo.cigarettesDailyCost =
      (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
    this.smokingInfo.cigarettesMontlyCost =
      (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30;
    this.smokingInfo.cigarettesYearlyCost =
      (req.packCigarettesPrice / req.cigarettesInPack) *
      req.cigarettesDay *
      365;
  }

  this.smokingInfo.cigarettesAvoidedCost =
    (req.packCigarettesPrice / req.cigarettesInPack) *
    this.smokingInfo.cigarettesAvoided;

  return this.save();
};

module.exports = mongoose.model("User", userShema);
