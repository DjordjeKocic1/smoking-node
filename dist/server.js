"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./errors/errorHandler");
const initPassport_1 = require("./helpers/initPassport");
const mongoose_1 = __importDefault(require("mongoose"));
const rootRoutes_1 = __importDefault(require("./routes/rootRoutes"));
require("dotenv").config();
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
(0, initPassport_1.initPassport)(app);
app.use(express_1.default.json());
app.use("/", rootRoutes_1.default);
app.use((error, _req, res) => {
    console.log("Middleware error", error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ error: message });
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    const server = app.listen(port, () => console.log("Server Start"));
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
        console.log("Client Connected");
    });
})
    .catch(() => {
    throw new errorHandler_1.http500Error("Someting went wrong. Please try again");
});
