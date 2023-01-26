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

  if (req.smokingInfo.cigarettesAvoided) {
    if (
      req.smokingInfo.packCigarettesPrice !=
        this.smokingInfo.packCigarettesPrice ||
      req.smokingInfo.cigarettesInPack != this.smokingInfo.cigarettesInPack
    ) {
      this.smokingInfo.cigarettesAvoidedCost =
        (this.smokingInfo.packCigarettesPrice /
          this.smokingInfo.cigarettesInPack) *
          req.smokingInfo.cigarettesAvoided +
        this.smokingInfo.cigarettesAvoidedCost;
    } else {
      this.smokingInfo.cigarettesAvoidedCost =
        (this.smokingInfo.packCigarettesPrice /
          this.smokingInfo.cigarettesInPack) *
        req.smokingInfo.cigarettesAvoided;
    }
  }

  this.smokingInfo.packCigarettesPrice = req.smokingInfo.packCigarettesPrice;
  this.smokingInfo.cigarettesInPack = req.smokingInfo.cigarettesInPack;
  this.smokingInfo.cigarettesDay = req.smokingInfo.cigarettesDay;
  this.smokingInfo.cigarettesAvoided = req.smokingInfo.cigarettesAvoided;

  return this.save();
};

module.exports = mongoose.model("User", userShema);
