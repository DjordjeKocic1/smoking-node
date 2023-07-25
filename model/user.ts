import { commonHelpers, userHealth } from "../helpers/helperClass";

import { IUser } from "../types/types";
import { calculations } from "../helpers/calcs";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userShema = new Schema(
  {
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
      avgHealth: Number,
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
    gameScore: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        name: String,
        categorieId: {
          type: Schema.Types.ObjectId,
          ref: "Categorie",
          req: true,
        },
      },
    ],
    achievements: [
      {
        name: String,
        achievementId: {
          type: Schema.Types.ObjectId,
          ref: "Achievement",
          req: true,
        },
      },
    ],
    tasks: [
      {
        name: String,
        taskId: {
          type: Schema.Types.ObjectId,
          ref: "Task",
        },
      },
    ],
    mentors: [
      {
        name: String,
        email: String,
        accepted: {
          type: Boolean,
          default: false,
        },
        mentorId: {
          type: Schema.Types.ObjectId,
          ref: "Mentor",
        },
      },
    ],
    notificationToken: String,
    subscriber: Boolean,
    subscribeDate: String,
  },
  { timestamps: true }
);

userShema.methods.calculateCosts = function (req: IUser): Promise<IUser> {
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

userShema.methods.calculateHealth = function (user: IUser): Promise<IUser> {
  const msDiff =
    new Date().getTime() -
    new Date(
      !!this.smokingInfo.dateOfQuiting
        ? this.smokingInfo.dateOfQuiting
        : new Date().toDateString()
    ).getTime();

  this.smokingInfo.noSmokingDays =
    !!user && !!user.smokingInfo && user.smokingInfo.isQuiting
      ? Math.floor(msDiff / (1000 * 60 * 60 * 24))
      : 0;

  const userHelperClass = new userHealth(this.smokingInfo.noSmokingDays);

  this.healthInfo.bloodPressure = userHelperClass.calcBloodPressure();
  this.healthInfo.heartRhythm = userHelperClass.calcHeartRhythm();
  this.healthInfo.COinBloodDecreases = userHelperClass.calcCOinBloodDecreases();
  this.healthInfo.physicalAndBodilyStrength = userHelperClass.calcphysicalStr();
  this.healthInfo.lungCapacity = userHelperClass.calcLungCapacity();
  this.healthInfo.irritatingCough = userHelperClass.calcIrritatingCough();
  this.healthInfo.stressTolerance = userHelperClass.calcStressTolerance();
  this.healthInfo.riskofheartAttack = userHelperClass.calcRiskofheartAttack();
  this.healthInfo.riskofKidneyCancer = userHelperClass.calcRiskofKidneyCancer();
  this.healthInfo.riskofThroatCancer = userHelperClass.calcRiskofThroatCancer();
  this.healthInfo.riskofLungeCancer = userHelperClass.calcRiskofLungeCancer();
  this.healthInfo.riskofStroke = userHelperClass.calcRiskofStroke();

  const healthObjKeys = commonHelpers.extractObjectKeys(this.healthInfo);
  const healthObjEntries = commonHelpers.extractObjectEntries(this.healthInfo);

  healthObjKeys.forEach((value) => {
    if (this.healthInfo[value] > 100) {
      this.healthInfo[value] = 100;
    }
  });

  let sum = 0;
  healthObjEntries.forEach(([key, value]) => {
    if (key != "avgHealth") {
      sum += value;
    }
  });

  this.healthInfo.avgHealth = (sum / healthObjEntries.length).toFixed(1);

  return this.save();
};

export default mongoose.model("User", userShema);
