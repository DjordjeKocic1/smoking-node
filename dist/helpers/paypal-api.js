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
exports.generateAccessToken = exports.capturePayment = exports.createOrder = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";
function createOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield generateAccessToken();
        console.log(accessToken);
        const url = `${base}/v2/checkout/orders`;
        const response = yield (0, node_fetch_1.default)(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "100.00",
                        },
                    },
                ],
            }),
        });
        return handleResponse(response);
    });
}
exports.createOrder = createOrder;
function capturePayment(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        const response = yield (0, node_fetch_1.default)(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return handleResponse(response);
    });
}
exports.capturePayment = capturePayment;
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString("base64");
        const response = yield (0, node_fetch_1.default)(`${base}/v1/oauth2/token`, {
            method: "post",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const jsonData = yield handleResponse(response);
        return jsonData.access_token;
    });
}
exports.generateAccessToken = generateAccessToken;
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (response.status === 200 || response.status === 201) {
            return response.json({ pp: "success" });
        }
        const errorMessage = yield response.text();
        throw new Error(errorMessage);
    });
}
