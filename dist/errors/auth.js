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
exports.verifyHeaderTokenAdmin = exports.verifyHeaderToken = void 0;
const user_1 = __importDefault(require("../model/user"));
const errorHandler_1 = require("./errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyHeaderToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token)
        throw new errorHandler_1.http401Error("Access denied. No token provided.");
    jsonwebtoken_1.default.verify(token, process.env.SESSION_SECRET, (error) => {
        if (error) {
            throw new errorHandler_1.http401Error("Token expired or invalid.");
        }
        else {
            next();
        }
    });
};
exports.verifyHeaderToken = verifyHeaderToken;
const verifyHeaderTokenAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("Authorization");
    if (!token)
        throw new errorHandler_1.http401Error("Access denied. No token provided.");
    let decoded = jsonwebtoken_1.default.verify(token, process.env.SESSION_SECRET);
    let email = decoded.email;
    let user = yield user_1.default.findOne({ email, roles: "admin" });
    if (!user) {
        throw new errorHandler_1.http401Error("You are not authorized to access this page");
    }
    else {
        next();
    }
});
exports.verifyHeaderTokenAdmin = verifyHeaderTokenAdmin;
