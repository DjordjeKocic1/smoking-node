"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalController = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const errorHandler_1 = require("../errors/errorHandler");
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
paypal_rest_sdk_1.default.configure({
    mode: "sandbox",
    client_id: PAYPAL_CLIENT_ID,
    client_secret: PAYPAL_SECRET,
});
const paypalPay = (req, res, next) => {
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "exp://192.168.0.11:19000",
            cancel_url: "exp://192.168.0.11:19000",
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "Mentoring",
                            sku: "001",
                            price: "5",
                            currency: "USD",
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: "USD",
                    total: "5",
                },
                description: "Mentoring system",
            },
        ],
    };
    paypal_rest_sdk_1.default.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        }
        else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.json({ link: payment.links[i].href });
                }
            }
        }
    });
};
const paypalSuccess = (req, res, next) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "5.00",
                },
            },
        ],
    };
    paypal_rest_sdk_1.default.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            throw new errorHandler_1.http500Error("Something went wrong when processing payment");
        }
        else {
            res.json({ payment: "success" });
        }
    });
};
const paypalCancel = (req, res, next) => {
    res.json({ payment: "cancel" });
};
exports.paypalController = {
    paypalPay,
    paypalSuccess,
    paypalCancel,
};
