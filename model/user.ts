import { commonHelpers, userHealth } from "../helpers/helperClass";

import { IUser } from "../types/types";
import { calculations } from "../helpers/calcs";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userShema = new Schema(
  {
    type: {
      type: String,
      default: "user",
    },
    image: String,
    name: String,
    address: String,
    city: String,
    country: String,
    email: {
      type: String,
      required: true,
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
      isQuiting: {
        type: Boolean,
        default: false,
      },
      dateOfQuiting: String,
      noSmokingDays: {
        type: Number,
        default: 0,
      },
    },
    consumptionInfo: {
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
      cigarettes5YearCost: Number,
      cigarettes10YearCost: Number,
      cigarettesAvoidedCost: Number,
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
        toDo: String,
        status: String,
        comment: String,
        mentorId: String,
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
    gameScore: {
      type: Number,
      default: 0,
    },
    latestScore: {
      type: Number,
      default: 0,
    },
    breathExercies: {
      type: Number,
      default: 0,
    },
    notificationToken: String,
    subscriber: Boolean,
    subscribeLasts: Number,
    subscribeDate: String,
    userVerified: Boolean,
  },
  { timestamps: true }
);

userShema.methods.calculateCosts = function (req: IUser): Promise<IUser> {
  if (!!req.type && !!req.userVerified) {
    this.type = req.type;
    this.userVerified = req.userVerified;
  }
  this.consumptionInfo.cigarettesAvoided =
    req.consumptionInfo.cigarettesAvoided;
  this.consumptionInfo.packCigarettesPrice =
    req.consumptionInfo.packCigarettesPrice;
  this.consumptionInfo.cigarettesInPack = req.consumptionInfo.cigarettesInPack;
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
    .cigAvoidedCost(req.consumptionInfo, this.consumptionInfo.cigarettesAvoided)
    .toFixed(1);

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

  if (this.subscriber) {
    const subscribeTimeDate =
      new Date().getTime() - new Date(this.subscribeDate).getTime();

    const subscribeTime = Math.floor(subscribeTimeDate / (1000 * 60 * 60 * 24));

    this.subscribeLasts = 30 - subscribeTime;

    if (subscribeTime >= 30) {
      this.subscriber = false;
    }
  }

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

export default mongoose.model<IUser>("User", userShema);
