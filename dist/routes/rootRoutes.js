"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const categorieController_1 = require("../controllers/categorieController");
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//Users
router.get("/users", userController_1.userController.getUsers);
router.post("/create-user", (0, express_validator_1.body)("email").isEmail(), userController_1.userController.createUser);
router.put("/update-user/:id", userController_1.userController.updateUser);
router.get("/user-health/:id", userController_1.userController.getUserHealth);
// Categories
router.get("/categories", categorieController_1.categorieController.getCategories);
router.post("/categories", categorieController_1.categorieController.createCategories);
module.exports = router;
