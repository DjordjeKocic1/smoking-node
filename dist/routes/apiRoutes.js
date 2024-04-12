"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restRoutes_1 = require("./restRoutes");
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../errors/errorHandler");
const viewRoutes_1 = require("./viewRoutes");
require("dotenv").config();
const router = express_1.default.Router();
(0, viewRoutes_1.viewRoutes)(router);
(0, restRoutes_1.adminRoutes)(router);
(0, restRoutes_1.userRoutes)(router);
(0, restRoutes_1.plansRoutes)(router);
(0, restRoutes_1.mentorRoutes)(router);
(0, restRoutes_1.taskRoutes)(router);
(0, restRoutes_1.notificationRoutes)(router);
(0, restRoutes_1.categorieRoutes)(router);
(0, restRoutes_1.achievementRoutes)(router);
(0, restRoutes_1.paymentRoutes)(router);
(0, restRoutes_1.feedbackRoutes)(router);
(0, restRoutes_1.authorizationRoutes)(router);
//404
router.all("*", (req, res, next) => {
    throw new errorHandler_1.http404Error(`Requested url:'${req.url}' not found`);
});
exports.default = router;
