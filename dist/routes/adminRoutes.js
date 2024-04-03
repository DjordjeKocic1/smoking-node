"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const errorRoute_1 = require("../errors/errorRoute");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const userController_1 = require("../controllers/userController");
require("dotenv").config();
const router = express_1.default.Router();
/* Views */
router.get("/login", (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, "../", "views/admin/", "login.html"));
});
router.get("/users", (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, "../", "views/admin/", "users.html"));
});
/* end */
router.post("/admin-login", [(0, errorRoute_1.checkUser)().checkUserEmail, (0, errorRoute_1.checkUser)().checkUserAdmin], userController_1.userController.userLogin);
router.get("/admin-users", (0, errorRoute_1.checkAuthorization)().checkToken, userController_1.userController.getUsers);
exports.adminRoutes = router;
