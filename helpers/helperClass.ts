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

export const userHealth = class UserHealth {
  constructor(private noSmokingDays: number) {}
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
