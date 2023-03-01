"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const taskSchema = new Schema({
    toDo: String,
    done: Boolean,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        req: true,
    },
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: "Mentor",
        req: true,
    },
});
exports.default = mongoose_1.default.model("Task", taskSchema);
