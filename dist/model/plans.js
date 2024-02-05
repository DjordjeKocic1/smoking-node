"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const plansShema = new Schema({
    name: {
        type: String,
        require: true,
    },
    userType: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        req: true,
    },
});
exports.default = mongoose_1.default.model("Plans", plansShema);
