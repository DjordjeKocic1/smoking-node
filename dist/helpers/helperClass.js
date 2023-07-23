"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHelper = exports.commonHelpers = void 0;
const commonHelpers = class Common {
    static extractObjectKeys(value) {
        return Object.keys(value);
    }
    static extractObjectValues(value) {
        return Object.values(value);
    }
    static extractObjectEntries(value) {
        return Object.entries(value);
    }
};
exports.commonHelpers = commonHelpers;
const userHelper = class UserHelper {
    static calculateBloodPressure(noSmokingDays) {
        return (noSmokingDays * 1.5).toFixed(1);
    }
    static calculateCOinBloodDecreases(noSmokingDays) {
        return (noSmokingDays * 1.3).toFixed(1);
    }
    static calculateHeartRhythm(noSmokingDays) {
        return (noSmokingDays * 1.4).toFixed(1);
    }
    static calculatephysicalStrength(noSmokingDays) {
        return (noSmokingDays * 1.2).toFixed(1);
    }
    static calculateLungCapacity(noSmokingDays) {
        return (noSmokingDays * 0.5).toFixed(1);
    }
    static calculateIrritatingCough(noSmokingDays) {
        return (noSmokingDays * 0.4).toFixed(1);
    }
    static calculateStressTolerance(noSmokingDays) {
        return (noSmokingDays * 0.4).toFixed(1);
    }
    static calculateRiskofheartAttack(noSmokingDays) {
        return (noSmokingDays * 0.3).toFixed(1);
    }
    static calculateRiskofKidneyCancer(noSmokingDays) {
        return (noSmokingDays * 0.3).toFixed(1);
    }
    static calculateRiskofThroatCancer(noSmokingDays) {
        return (noSmokingDays * 0.3).toFixed(1);
    }
    static calculateRiskofLungeCancer(noSmokingDays) {
        return (noSmokingDays * 0.3).toFixed(1);
    }
    static calculateRiskofStroke(noSmokingDays) {
        return (noSmokingDays * 0.3).toFixed(1);
    }
};
exports.userHelper = userHelper;
