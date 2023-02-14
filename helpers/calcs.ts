const cigDailyCosts = (req: any) => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
};

const cigMontlyCost = (req: any) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30
  );
};

const cigYearlyCost = (req: any) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 365
  );
};
const cig5YearCost = (req: any) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    5
  );
};

const cig10YearCost = (req: any) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    10
  );
};

const cigAvoidedCost = (req: any, avoided: any) => {
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
