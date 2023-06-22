"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
require("dotenv").config();
const keyGetStripe = (req, res, next) => {
    return res.send(process.env.STRIPE_KEY);
};
exports.paymentController = {
    keyGetStripe,
};
