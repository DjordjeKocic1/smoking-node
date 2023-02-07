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
  healthInfo: {
    bloodPressure: Number,
    heartRhythm: Number,
    COinBloodDecreases: Number,
    lungCapacity: Number,
    physicalAndBodilyStrength: Number,
    riskofheartAttack: Number,
    irritatingCough: Number,
    stressTolerance: Number,
    riskofLungeCancer: Number,
    riskofThroatCancer: Number,
    riskofKidneyCancer: Number,
    riskofStroke: Number,
  },
  smokingInfo: {
    isQuiting: Boolean,
    dateOfQuiting: String,
    noSmokingDays: Number,
  },
  consumptionInfo: {
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

    this.savedInfo.cigarettesDailyCost = calculations
      .cigDailyCosts(req.savedInfo)
      .toFixed(1);
    this.savedInfo.cigarettesMontlyCost = calculations
      .cigMontlyCost(req.savedInfo)
      .toFixed(1);
    this.savedInfo.cigarettesYearlyCost = calculations
      .cigYearlyCost(req.savedInfo)
      .toFixed(1);
    this.savedInfo.cigarettes5YearCost = calculations
      .cig5YearCost(req.savedInfo)
      .toFixed(1);
    this.savedInfo.cigarettes10YearCost = calculations
      .cig10YearCost(req.savedInfo)
      .toFixed(1);
    this.savedInfo.cigarettesAvoidedCost = calculations
      .cigAvoidedCost(req.savedInfo, this.savedInfo.cigarettesAvoided)
      .toFixed(1);
  } else {
    this.consumptionInfo.cigarettesAvoided =
      req.consumptionInfo.cigarettesAvoided;
    this.consumptionInfo.packCigarettesPrice =
      req.consumptionInfo.packCigarettesPrice;
    this.consumptionInfo.cigarettesInPack =
      req.consumptionInfo.cigarettesInPack;
    this.consumptionInfo.cigarettesDay = req.consumptionInfo.cigarettesDay;

    this.consumptionInfo.cigarettesDailyCost = calculations
      .cigDailyCosts(req.consumptionInfo)
      .toFixed(1);
    this.consumptionInfo.cigarettesMontlyCost = calculations
      .cigMontlyCost(req.consumptionInfo)
      .toFixed(1);
    this.consumptionInfo.cigarettesYearlyCost = calculations
      .cigYearlyCost(req.consumptionInfo)
      .toFixed(1);
    this.consumptionInfo.cigarettes5YearCost = calculations
      .cig5YearCost(req.consumptionInfo)
      .toFixed(1);
    this.consumptionInfo.cigarettes10YearCost = calculations
      .cig10YearCost(req.consumptionInfo)
      .toFixed(1);
    this.consumptionInfo.cigarettesAvoidedCost = calculations
      .cigAvoidedCost(
        req.consumptionInfo,
        this.consumptionInfo.cigarettesAvoided
      )
      .toFixed(1);
  }

  return this.save();
};

userShema.methods.calculateHealth = function (req) {
  this.healthInfo.bloodPressure = (req.smokingInfo.noSmokingDays * 2.7).toFixed(
    1
  );
  this.healthInfo.heartRhythm = (req.smokingInfo.noSmokingDays * 2.5).toFixed(
    1
  );
  this.healthInfo.COinBloodDecreases = (
    req.smokingInfo.noSmokingDays * 2.3
  ).toFixed(1);
  this.healthInfo.physicalAndBodilyStrength = (
    req.smokingInfo.noSmokingDays * 2.1
  ).toFixed(1);
  this.healthInfo.lungCapacity = (req.smokingInfo.noSmokingDays * 0.5).toFixed(
    1
  );
  this.healthInfo.irritatingCough = (
    req.smokingInfo.noSmokingDays * 0.4
  ).toFixed(1);
  this.healthInfo.stressTolerance = (
    req.smokingInfo.noSmokingDays * 0.4
  ).toFixed(1);
  this.healthInfo.riskofheartAttack = (
    req.smokingInfo.noSmokingDays * 0.3
  ).toFixed(1);
  this.healthInfo.riskofKidneyCancer = (
    req.smokingInfo.noSmokingDays * 0.3
  ).toFixed(1);
  this.healthInfo.riskofThroatCancer = (
    req.smokingInfo.noSmokingDays * 0.3
  ).toFixed(1);
  this.healthInfo.riskofLungeCancer = (
    req.smokingInfo.noSmokingDays * 0.3
  ).toFixed(1);
  this.healthInfo.riskofStroke = (req.smokingInfo.noSmokingDays * 0.3).toFixed(
    1
  );

  if (this.healthInfo.bloodPressure > 100) {
    this.healthInfo.bloodPressure = 100;
  }

  if (this.healthInfo.heartRhythm > 100) {
    this.healthInfo.heartRhythm = 100;
  }

  if (this.healthInfo.COinBloodDecreases > 100) {
    this.healthInfo.COinBloodDecreases = 100;
  }

  if (this.healthInfo.physicalAndBodilyStrength > 100) {
    this.healthInfo.physicalAndBodilyStrength = 100;
  }

  if (this.healthInfo.lungCapacity > 100) {
    this.healthInfo.lungCapacity = 100;
  }

  if (this.healthInfo.riskofheartAttack > 100) {
    this.healthInfo.riskofheartAttack = 100;
  }

  if (this.healthInfo.irritatingCough > 100) {
    this.healthInfo.irritatingCough = 100;
  }

  if (this.healthInfo.stressTolerance > 100) {
    this.healthInfo.stressTolerance = 100;
  }

  if (this.healthInfo.riskofThroatCancer > 100) {
    this.healthInfo.riskofThroatCancer = 100;
    this.healthInfo.riskofKidneyCancer = 100;
    this.healthInfo.riskofLungeCancer = 100;
    this.healthInfo.riskofStroke = 100;
  }

  return this.save();
};

module.exports = mongoose.model("User", userShema);
