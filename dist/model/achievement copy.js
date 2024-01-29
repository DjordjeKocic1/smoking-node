"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const achievementShema = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: String,
    categorie: String,
    points: String,
    type: String,
    tag: Number,
});
exports.default = mongoose_1.default.model("Achievement", achievementShema);
