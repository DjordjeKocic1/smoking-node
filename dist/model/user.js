"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calcs_1 = require("../helpers/calcs");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    mentorNotification: {
        fromEmail: String,
    },
});
userShema.methods.calculateCosts = function (req) {
    if (req.savedInfo) {
        this.savedInfo.packCigarettesPrice = req.savedInfo.packCigarettesPrice;
        this.savedInfo.cigarettesInPack = req.savedInfo.cigarettesInPack;
        this.savedInfo.cigarettesDay = req.savedInfo.cigarettesDay;
        this.savedInfo.cigarettesAvoided = req.savedInfo.cigarettesAvoided;
        this.savedInfo.cigarettesDailyCost = calcs_1.calculations
            .cigDailyCosts(req.savedInfo)
            .toFixed(1);
        this.savedInfo.cigarettesMontlyCost = calcs_1.calculations
            .cigMontlyCost(req.savedInfo)
            .toFixed(1);
        this.savedInfo.cigarettesYearlyCost = calcs_1.calculations
            .cigYearlyCost(req.savedInfo)
            .toFixed(1);
        this.savedInfo.cigarettes5YearCost = calcs_1.calculations
            .cig5YearCost(req.savedInfo)
            .toFixed(1);
        this.savedInfo.cigarettes10YearCost = calcs_1.calculations
            .cig10YearCost(req.savedInfo)
            .toFixed(1);
        this.savedInfo.cigarettesAvoidedCost = calcs_1.calculations
            .cigAvoidedCost(req.savedInfo, this.savedInfo.cigarettesAvoided)
            .toFixed(1);
    }
    else {
        this.consumptionInfo.cigarettesAvoided =
            req.consumptionInfo.cigarettesAvoided;
        this.consumptionInfo.packCigarettesPrice =
            req.consumptionInfo.packCigarettesPrice;
        this.consumptionInfo.cigarettesInPack =
            req.consumptionInfo.cigarettesInPack;
        this.consumptionInfo.cigarettesDay = req.consumptionInfo.cigarettesDay;
        this.consumptionInfo.cigarettesDailyCost = calcs_1.calculations
            .cigDailyCosts(req.consumptionInfo)
            .toFixed(1);
        this.consumptionInfo.cigarettesMontlyCost = calcs_1.calculations
            .cigMontlyCost(req.consumptionInfo)
            .toFixed(1);
        this.consumptionInfo.cigarettesYearlyCost = calcs_1.calculations
            .cigYearlyCost(req.consumptionInfo)
            .toFixed(1);
        this.consumptionInfo.cigarettes5YearCost = calcs_1.calculations
            .cig5YearCost(req.consumptionInfo)
            .toFixed(1);
        this.consumptionInfo.cigarettes10YearCost = calcs_1.calculations
            .cig10YearCost(req.consumptionInfo)
            .toFixed(1);
        this.consumptionInfo.cigarettesAvoidedCost = calcs_1.calculations
            .cigAvoidedCost(req.consumptionInfo, this.consumptionInfo.cigarettesAvoided)
            .toFixed(1);
    }
    return this.save();
};
userShema.methods.calculateHealth = function (user) {
    const msDiff = new Date().getTime() -
        new Date(!!this.smokingInfo.dateOfQuiting
            ? this.smokingInfo.dateOfQuiting
            : new Date().toDateString()).getTime();
    this.smokingInfo.noSmokingDays =
        !!user && !!user.smokingInfo && user.smokingInfo.isQuiting
            ? Math.floor(msDiff / (1000 * 60 * 60 * 24))
            : 0;
    this.healthInfo.bloodPressure = (this.smokingInfo.noSmokingDays * 1.5).toFixed(1);
    this.healthInfo.heartRhythm = (this.smokingInfo.noSmokingDays * 1.4).toFixed(1);
    this.healthInfo.COinBloodDecreases = (this.smokingInfo.noSmokingDays * 1.3).toFixed(1);
    this.healthInfo.physicalAndBodilyStrength = (this.smokingInfo.noSmokingDays * 1.2).toFixed(1);
    this.healthInfo.lungCapacity = (this.smokingInfo.noSmokingDays * 0.5).toFixed(1);
    this.healthInfo.irritatingCough = (this.smokingInfo.noSmokingDays * 0.4).toFixed(1);
    this.healthInfo.stressTolerance = (this.smokingInfo.noSmokingDays * 0.4).toFixed(1);
    this.healthInfo.riskofheartAttack = (this.smokingInfo.noSmokingDays * 0.3).toFixed(1);
    this.healthInfo.riskofKidneyCancer = (this.smokingInfo.noSmokingDays * 0.3).toFixed(1);
    this.healthInfo.riskofThroatCancer = (this.smokingInfo.noSmokingDays * 0.3).toFixed(1);
    this.healthInfo.riskofLungeCancer = (this.smokingInfo.noSmokingDays * 0.3).toFixed(1);
    this.healthInfo.riskofStroke = (this.smokingInfo.noSmokingDays * 0.3).toFixed(1);
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
    this.healthInfo.avgHealth = ((this.healthInfo.bloodPressure +
        this.healthInfo.heartRhythm +
        this.healthInfo.COinBloodDecreases +
        this.healthInfo.lungCapacity +
        this.healthInfo.physicalAndBodilyStrength +
        this.healthInfo.riskofheartAttack +
        this.healthInfo.stressTolerance +
        this.healthInfo.riskofLungeCancer +
        this.healthInfo.riskofThroatCancer +
        this.healthInfo.riskofStroke) /
        10).toFixed(1);
    return this.save();
};
exports.default = mongoose_1.default.model("User", userShema);
