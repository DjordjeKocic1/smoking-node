"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHealth = exports.commonHelpers = void 0;
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
const userHealth = class UserHealth {
    constructor(noSmokingDays) {
        this.noSmokingDays = noSmokingDays;
    }
    calcBloodPressure() {
        return (this.noSmokingDays * 1.5).toFixed(1);
    }
    calcCOinBloodDecreases() {
        return (this.noSmokingDays * 1.3).toFixed(1);
    }
    calcHeartRhythm() {
        return (this.noSmokingDays * 1.4).toFixed(1);
    }
    calcphysicalStr() {
        return (this.noSmokingDays * 1.2).toFixed(1);
    }
    calcLungCapacity() {
        return (this.noSmokingDays * 0.5).toFixed(1);
    }
    calcIrritatingCough() {
        return (this.noSmokingDays * 0.4).toFixed(1);
    }
    calcStressTolerance() {
        return (this.noSmokingDays * 0.4).toFixed(1);
    }
    calcRiskofheartAttack() {
        return (this.noSmokingDays * 0.3).toFixed(1);
    }
    calcRiskofKidneyCancer() {
        return (this.noSmokingDays * 0.3).toFixed(1);
    }
    calcRiskofThroatCancer() {
        return (this.noSmokingDays * 0.3).toFixed(1);
    }
    calcRiskofLungeCancer() {
        return (this.noSmokingDays * 0.3).toFixed(1);
    }
    calcRiskofStroke() {
        return (this.noSmokingDays * 0.3).toFixed(1);
    }
};
exports.userHealth = userHealth;
