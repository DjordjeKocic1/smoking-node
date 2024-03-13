"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const sessionSchema = new Schema({
    type: { type: String, enum: ["tokenRequest", "deleteRequest"] },
    expireAt: {
        type: Date,
    },
    userId: String,
    email: String,
    token: String,
});
exports.default = mongoose_1.default.model("Sessions", sessionSchema);
