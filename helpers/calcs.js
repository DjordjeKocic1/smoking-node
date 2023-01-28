exports.cigDailyCosts = (req) => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
};

exports.cigMontlyCost = (req) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30
  );
};

exports.cigYearlyCost = (req) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 365
  );
};
exports.cig5YearCost = (req) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    5
  );
};

exports.cig10YearCost = (req) => {
  return (
    (req.packCigarettesPrice / req.cigarettesInPack) *
    req.cigarettesDay *
    365 *
    10
  );
};

exports.cigAvoidedCost = (req, avoided) => {
  return (req.packCigarettesPrice / req.cigarettesInPack) * avoided;
};
