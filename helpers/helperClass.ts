export const commonHelpers = class Common {
  static extractObjectKeys<T extends object>(value: T) {
    return Object.keys(value);
  }
  static extractObjectValues<T extends object>(value: T): string[] {
    return Object.values(value);
  }
  static extractObjectEntries<T extends object>(value: T): [string, number][] {
    return Object.entries(value);
  }
};

export const userHelper = class UserHelper {
  static calculateBloodPressure(noSmokingDays: number) {
    return (noSmokingDays * 1.5).toFixed(1);
  }
  static calculateCOinBloodDecreases(noSmokingDays: number) {
    return (noSmokingDays * 1.3).toFixed(1);
  }
  static calculateHeartRhythm(noSmokingDays: number) {
    return (noSmokingDays * 1.4).toFixed(1);
  }
  static calculatephysicalStrength(noSmokingDays: number) {
    return (noSmokingDays * 1.2).toFixed(1);
  }
  static calculateLungCapacity(noSmokingDays: number) {
    return (noSmokingDays * 0.5).toFixed(1);
  }
  static calculateIrritatingCough(noSmokingDays: number) {
    return (noSmokingDays * 0.4).toFixed(1);
  }
  static calculateStressTolerance(noSmokingDays: number) {
    return (noSmokingDays * 0.4).toFixed(1);
  }
  static calculateRiskofheartAttack(noSmokingDays: number) {
    return (noSmokingDays * 0.3).toFixed(1);
  }
  static calculateRiskofKidneyCancer(noSmokingDays: number) {
    return (noSmokingDays * 0.3).toFixed(1);
  }
  static calculateRiskofThroatCancer(noSmokingDays: number) {
    return (noSmokingDays * 0.3).toFixed(1);
  }
  static calculateRiskofLungeCancer(noSmokingDays: number) {
    return (noSmokingDays * 0.3).toFixed(1);
  }
  static calculateRiskofStroke(noSmokingDays: number) {
    return (noSmokingDays * 0.3).toFixed(1);
  }
};
