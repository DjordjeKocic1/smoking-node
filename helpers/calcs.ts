import { IConsumptionInfo } from "../types/types";

const cigDailyCosts = (req: IConsumptionInfo): number => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
};

const cigMontlyCost = (req: IConsumptionInfo): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30
  );
};

const cigYearlyCost = (req: IConsumptionInfo): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 365
  );
};
const cig5YearCost = (req: IConsumptionInfo): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    5
  );
};

const cig10YearCost = (req: IConsumptionInfo): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    10
  );
};

const cigAvoidedCost = (req: IConsumptionInfo, avoided: any): number => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * avoided;
};

export const calculations = {
  cigDailyCosts,
  cigMontlyCost,
  cigYearlyCost,
  cig5YearCost,
  cig10YearCost,
  cigAvoidedCost,
};
