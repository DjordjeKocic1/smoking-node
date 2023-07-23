"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculations = void 0;
const cigDailyCosts = (req) => {
    return (req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay;
};
const cigMontlyCost = (req) => {
    return ((req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 30);
};
const cigYearlyCost = (req) => {
    return ((req.packCigarettesPrice / req.cigarettesInPack) * req.cigarettesDay * 365);
};
const cig5YearCost = (req) => {
    return ((req.packCigarettesPrice / req.cigarettesInPack) *
        req.cigarettesDay *
        365 *
        5);
};
const cig10YearCost = (req) => {
    return ((req.packCigarettesPrice / req.cigarettesInPack) *
        req.cigarettesDay *
        365 *
        10);
};
const cigAvoidedCost = (req, avoided) => {
    return (req.packCigarettesPrice / req.cigarettesInPack) * +avoided;
};
exports.calculations = {
    cigDailyCosts,
    cigMontlyCost,
    cigYearlyCost,
    cig5YearCost,
    cig10YearCost,
    cigAvoidedCost,
};
