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
    plans: [
        {
            name: String,
            completed: Boolean,
            plansId: {
                type: Schema.Types.ObjectId,
                ref: "Plans",
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
    breathExercies: {
        type: Number,
        default: 0,
    },
    subscription: {
        subscriber: Boolean,
        subscribeLasts: Number,
        subscribeDate: String,
    },
    notificationToken: String,
    userVerified: Boolean,
}, { timestamps: true });
userShema.methods.calculateCosts = function (req) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _o, _p, _q, _r;
    if (!!req.type && !!req.userVerified) {
        this.type = req.type;
        this.userVerified = req.userVerified;
    }
    (_a = (_o = this.consumptionInfo).cigarettesAvoided) !== null && _a !== void 0 ? _a : (_o.cigarettesAvoided = req.consumptionInfo.cigarettesAvoided);
    (_b = (_p = this.consumptionInfo).packCigarettesPrice) !== null && _b !== void 0 ? _b : (_p.packCigarettesPrice = req.consumptionInfo.packCigarettesPrice);
    (_c = (_q = this.consumptionInfo).cigarettesInPack) !== null && _c !== void 0 ? _c : (_q.cigarettesInPack = req.consumptionInfo.cigarettesInPack);
    (_d = (_r = this.consumptionInfo).cigarettesDay) !== null && _d !== void 0 ? _d : (_r.cigarettesDay = req.consumptionInfo.cigarettesDay);
    this.consumptionInfo.cigarettesDailyCost = calcs_1.calculations
        .cigDailyCosts((_e = req.consumptionInfo) !== null && _e !== void 0 ? _e : this.consumptionInfo)
        .toFixed(1);
    this.consumptionInfo.cigarettesMontlyCost = calcs_1.calculations
        .cigMontlyCost((_f = req.consumptionInfo) !== null && _f !== void 0 ? _f : this.consumptionInfo)
        .toFixed(1);
    this.consumptionInfo.cigarettesYearlyCost = calcs_1.calculations
        .cigYearlyCost((_g = req.consumptionInfo) !== null && _g !== void 0 ? _g : this.consumptionInfo)
        .toFixed(1);
    this.consumptionInfo.cigarettes5YearCost = calcs_1.calculations
        .cig5YearCost((_h = req.consumptionInfo) !== null && _h !== void 0 ? _h : this.consumptionInfo)
        .toFixed(1);
    this.consumptionInfo.cigarettes10YearCost = calcs_1.calculations
        .cig10YearCost((_j = req.consumptionInfo) !== null && _j !== void 0 ? _j : this.consumptionInfo)
        .toFixed(1);
    this.consumptionInfo.cigarettesAvoidedCost = this.smokingInfo.isQuiting
        ? (calcs_1.calculations.cigDailyCosts((_k = req.consumptionInfo) !== null && _k !== void 0 ? _k : this.consumptionInfo) *
            this.smokingInfo.noSmokingDays +
            calcs_1.calculations.cigAvoidedCost((_l = req.consumptionInfo) !== null && _l !== void 0 ? _l : this.consumptionInfo, this.consumptionInfo.cigarettesAvoided)).toFixed(1)
        : calcs_1.calculations
            .cigAvoidedCost((_m = req.consumptionInfo) !== null && _m !== void 0 ? _m : this.consumptionInfo, this.consumptionInfo.cigarettesAvoided)
            .toFixed(1);
    return this.save();
};
userShema.methods.calculateHealth = function (user) {
    const msDiff = new Date().getTime() -
        new Date(!!this.smokingInfo.dateOfQuiting
            ? this.smokingInfo.dateOfQuiting
            : new Date().toDateString()).getTime();
    if (this.subscription.subscriber) {
        const subscribeTimeDate = new Date().getTime() -
            new Date(this.subscription.subscribeDate).getTime();
        const subscribeTime = Math.floor(subscribeTimeDate / (1000 * 60 * 60 * 24));
        this.subscription.subscribeLasts = 30 - subscribeTime;
        if (subscribeTime >= 30) {
            this.subscription.subscriber = false;
            this.subscription.subscribeLasts = 0;
        }
    }
    this.smokingInfo.noSmokingDays =
        !!user && !!user.smokingInfo && user.smokingInfo.isQuiting
            ? Math.floor(msDiff / (1000 * 60 * 60 * 24))
            : 0;
    const userHelperClass = new helperClass_1.userHealth(this.smokingInfo.noSmokingDays);
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
    const healthObjKeys = helperClass_1.commonHelpers.extractObjectKeys(this.healthInfo);
    healthObjKeys.forEach((value) => {
        if (this.healthInfo[value] > 100) {
            this.healthInfo[value] = 100;
        }
    });
    const healthObjEntries = helperClass_1.commonHelpers.extractObjectEntries(this.healthInfo);
    let sum = 0;
    healthObjEntries.forEach(([key, value]) => {
        if (key != "avgHealth") {
            sum += value;
        }
    });
    this.healthInfo.avgHealth = (sum / healthObjEntries.length - 1).toFixed(1);
    if (this.healthInfo.avgHealth <= 0) {
        this.healthInfo.avgHealth = 0;
    }
    return this.save();
};
exports.default = mongoose_1.default.model("User", userShema);
