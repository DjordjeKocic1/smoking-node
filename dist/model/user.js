"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helperClass_1 = require("../helpers/helperClass");
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
    notificationToken: String,
    subscriber: Boolean,
    subscribeDate: String,
}, { timestamps: true });
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
    this.healthInfo.bloodPressure = helperClass_1.userHelper.calculateBloodPressure(this.smokingInfo.noSmokingDays);
    this.healthInfo.heartRhythm = helperClass_1.userHelper.calculateHeartRhythm(this.smokingInfo.noSmokingDays);
    this.healthInfo.COinBloodDecreases = helperClass_1.userHelper.calculateCOinBloodDecreases(this.smokingInfo.noSmokingDays);
    this.healthInfo.physicalAndBodilyStrength =
        helperClass_1.userHelper.calculatephysicalStrength(this.smokingInfo.noSmokingDays);
    this.healthInfo.lungCapacity = helperClass_1.userHelper.calculateLungCapacity(this.smokingInfo.noSmokingDays);
    this.healthInfo.irritatingCough = helperClass_1.userHelper.calculateIrritatingCough(this.smokingInfo.noSmokingDays);
    this.healthInfo.stressTolerance = helperClass_1.userHelper.calculateStressTolerance(this.smokingInfo.noSmokingDays);
    this.healthInfo.riskofheartAttack = helperClass_1.userHelper.calculateRiskofheartAttack(this.smokingInfo.noSmokingDays);
    this.healthInfo.riskofKidneyCancer = helperClass_1.userHelper.calculateRiskofKidneyCancer(this.smokingInfo.noSmokingDays);
    this.healthInfo.riskofThroatCancer = helperClass_1.userHelper.calculateRiskofThroatCancer(this.smokingInfo.noSmokingDays);
    this.healthInfo.riskofLungeCancer = helperClass_1.userHelper.calculateRiskofLungeCancer(this.smokingInfo.noSmokingDays);
    this.healthInfo.riskofStroke = helperClass_1.userHelper.calculateRiskofStroke(this.smokingInfo.noSmokingDays);
    const healthObjKeys = helperClass_1.commonHelpers.extractObjectKeys(this.healthInfo);
    const healthObj = helperClass_1.commonHelpers.extractObjectEntries(this.healthInfo);
    healthObjKeys.forEach((value) => {
        if (this.healthInfo[value] > 100) {
            this.healthInfo[value] = 100;
        }
    });
    let sum = 0;
    healthObj.forEach(([key, value]) => {
        if (key != "avgHealth") {
            sum += value;
        }
    });
    this.healthInfo.avgHealth = (sum / healthObj.length).toFixed(1);
    return this.save();
};
exports.default = mongoose_1.default.model("User", userShema);
