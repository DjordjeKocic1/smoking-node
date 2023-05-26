"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const rootRoutes_1 = __importDefault(require("./routes/rootRoutes"));
require("dotenv").config();
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/send-user-info", rootRoutes_1.default);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
})
    .catch((err) => console.log("Db error:", err));
