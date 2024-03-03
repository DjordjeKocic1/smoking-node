"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./errors/errorHandler");
const initPassport_1 = require("./helpers/initPassport");
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const rootRoutes_1 = __importDefault(require("./routes/rootRoutes"));
require("dotenv").config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { index: false }));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
(0, initPassport_1.initPassport)(app);
app.use("/", rootRoutes_1.default);
app.use((error, req, res, next) => {
    console.log("Middleware error", error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ error: message });
});
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    const server = app.listen(port);
    const io = require("./socket").init(server);
    console.log("Server connected", "ENV:", process.env.NODE_ENV);
    io.on("connection", () => {
        console.log("Client Connected");
    });
})
    .catch(() => {
    throw new errorHandler_1.http500Error();
});
