const cigDailyCosts = (req: any): number => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
};

const cigMontlyCost = (req: any): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30
  );
};

const cigYearlyCost = (req: any): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 365
  );
};
const cig5YearCost = (req: any): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    5
  );
};

const cig10YearCost = (req: any): number => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    10
  );
};

const cigAvoidedCost = (req: any, avoided: any): number => {
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
