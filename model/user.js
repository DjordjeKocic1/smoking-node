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
    cigarettesAvoided: Number,
    cigarettesDailyCost: Number,
    cigarettesMontlyCost: Number,
    cigarettesYearlyCost: Number,
    cigarettesAvoidedCost: Number,
  },
  savedInfo: {
    cigarettesDay: Number,
    packCigarettesPrice: Number,
    cigarettesInPack: Number,
    cigarettesDailyCost: Number,
    cigarettesMontlyCost: Number,
    cigarettesYearlyCost: Number,
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
  //Updated smoking info
  if (req.savedInfo) {
    this.savedInfo.packCigarettesPrice = req.savedInfo.packCigarettesPrice;
    this.savedInfo.cigarettesInPack = req.savedInfo.cigarettesInPack;
    this.savedInfo.cigarettesDay = req.savedInfo.cigarettesDay;
  } else {
    this.smokingInfo.cigarettesAvoided = req.smokingInfo.cigarettesAvoided;
    this.smokingInfo.packCigarettesPrice = req.smokingInfo.packCigarettesPrice;
    this.smokingInfo.cigarettesInPack = req.smokingInfo.cigarettesInPack;
    this.smokingInfo.cigarettesDay = req.smokingInfo.cigarettesDay;
  }

  if (!req.savedInfo) {
    this.smokingInfo.cigarettesDailyCost =
      (req.smokingInfo.packCigarettesPrice / req.smokingInfo.cigarettesInPack) *
      req.smokingInfo.cigarettesDay;
    this.smokingInfo.cigarettesMontlyCost =
      (req.smokingInfo.packCigarettesPrice / req.smokingInfo.cigarettesInPack) *
      req.smokingInfo.cigarettesDay *
      30;
    this.smokingInfo.cigarettesYearlyCost =
      (req.smokingInfo.packCigarettesPrice / req.smokingInfo.cigarettesInPack) *
      req.smokingInfo.cigarettesDay *
      365;
    this.smokingInfo.cigarettesAvoidedCost =
      (req.smokingInfo.packCigarettesPrice / req.smokingInfo.cigarettesInPack) *
      this.smokingInfo.cigarettesAvoided;
  } else {
    this.savedInfo.cigarettesDailyCost =
      (req.savedInfo.packCigarettesPrice / req.savedInfo.cigarettesInPack) *
      req.savedInfo.cigarettesDay;
    this.savedInfo.cigarettesMontlyCost =
      (req.savedInfo.packCigarettesPrice / req.savedInfo.cigarettesInPack) *
      req.savedInfo.cigarettesDay *
      30;
    this.savedInfo.cigarettesYearlyCost =
      (req.savedInfo.packCigarettesPrice / req.savedInfo.cigarettesInPack) *
      req.savedInfo.cigarettesDay *
      365;
    this.savedInfo.cigarettesAvoidedCost =
      (req.savedInfo.packCigarettesPrice / req.savedInfo.cigarettesInPack) *
      this.savedInfo.cigarettesAvoided;
  }

  return this.save();
};

module.exports = mongoose.model("User", userShema);
