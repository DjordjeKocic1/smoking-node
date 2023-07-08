"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalController = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
require("dotenv").config();
paypal_rest_sdk_1.default.configure({
    mode: "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET,
});
const paypalPay = (req, res, next) => {
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://192.168.56.1:8000/success",
            cancel_url: "http://192.168.56.1:8000/cancel",
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "Mentoring",
                            sku: "1",
                            price: "5.00",
                            currency: "USD",
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: "USD",
                    total: "5.00",
                },
                description: "Mentoring request",
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
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
};
exports.paypalController = {
    paypalPay,
};
