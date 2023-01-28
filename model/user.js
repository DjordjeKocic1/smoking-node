const mongoose = require("mongoose");
const calculations = require("../helpers/calcs");
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
    cigarettes5YearCost: Number,
    cigarettes10YearCost: Number,
    cigarettesAvoidedCost: Number,
  },
  savedInfo: {
    cigarettesDay: Number,
    packCigarettesPrice: Number,
    cigarettesInPack: Number,
    cigarettesDailyCost: Number,
    cigarettesMontlyCost: Number,
    cigarettesYearlyCost: Number,
    cigarettes5YearCost: Number,
    cigarettes10YearCost: Number,
    cigarettesAvoidedCost: Number,
    cigarettesAvoided: Number,
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
  if (req.savedInfo) {
    this.savedInfo.packCigarettesPrice = req.savedInfo.packCigarettesPrice;
    this.savedInfo.cigarettesInPack = req.savedInfo.cigarettesInPack;
    this.savedInfo.cigarettesDay = req.savedInfo.cigarettesDay;
    this.savedInfo.cigarettesAvoided = req.savedInfo.cigarettesAvoided;

    this.savedInfo.cigarettesDailyCost = calculations.cigDailyCosts(
      req.savedInfo
    );
    this.savedInfo.cigarettesMontlyCost = calculations.cigMontlyCost(
      req.savedInfo
    );
    this.savedInfo.cigarettesYearlyCost = calculations.cigYearlyCost(
      req.savedInfo
    );
    this.savedInfo.cigarettes5YearCost = calculations.cig5YearCost(
      req.savedInfo
    );
    this.savedInfo.cigarettes10YearCost = calculations.cig10YearCost(
      req.savedInfo
    );
    this.savedInfo.cigarettesAvoidedCost = calculations.cigAvoidedCost(
      req.savedInfo,
      this.savedInfo.cigarettesAvoided
    );
  } else {
    this.smokingInfo.cigarettesAvoided = req.smokingInfo.cigarettesAvoided;
    this.smokingInfo.packCigarettesPrice = req.smokingInfo.packCigarettesPrice;
    this.smokingInfo.cigarettesInPack = req.smokingInfo.cigarettesInPack;
    this.smokingInfo.cigarettesDay = req.smokingInfo.cigarettesDay;

    this.smokingInfo.cigarettesDailyCost = calculations.cigDailyCosts(
      req.smokingInfo
    );
    this.smokingInfo.cigarettesMontlyCost = calculations.cigMontlyCost(
      req.smokingInfo
    );
    this.smokingInfo.cigarettesYearlyCost = calculations.cigYearlyCost(
      req.smokingInfo
    );
    this.smokingInfo.cigarettes5YearCost = calculations.cig5YearCost(
      req.smokingInfo
    );
    this.smokingInfo.cigarettes10YearCost = calculations.cig10YearCost(
      req.smokingInfo
    );
    this.smokingInfo.cigarettesAvoidedCost = calculations.cigAvoidedCost(
      req.smokingInfo,
      this.smokingInfo.cigarettesAvoided
    );
  }

  return this.save();
};

module.exports = mongoose.model("User", userShema);
