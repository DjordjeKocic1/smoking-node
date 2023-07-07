"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
require("dotenv").config();
const keyGetStripe = (req, res, next) => {
    return res.send(process.env.STRIPE_KEY_LIVE);
};
const paymentSheet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secret_key = process.env.STRIPE_SECRET_LIVE;
    const stripe = new stripe_1.default(secret_key, {
        apiVersion: "2022-11-15",
        typescript: true,
    });
    yield stripe.customers.create({
        description: !req.body.email ? "New customer" : req.body.email,
    });
    const customers = yield stripe.customers.list();
    const customer = customers.data[0];
    if (!customer) {
        return res.send({
            error: "You have no customer created",
        });
    }
    const ephemeralKey = yield stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: "2022-11-15" });
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: 500,
        currency: "usd",
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return res.status(201).json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
    });
});
exports.paymentController = {
    keyGetStripe,
    paymentSheet,
};
