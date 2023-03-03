"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const notificationSchema = new Schema({
    message: String,
    toEmail: String,
    isMentoring: Boolean,
    isAchievement: Boolean,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        req: true,
    },
});
exports.default = mongoose_1.default.model("Notification", notificationSchema);