"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errorRoute_1 = require("../errors/errorRoute");
const user_1 = __importDefault(require("../model/user"));
const achievementController_1 = require("../controllers/achievementController");
const categorieController_1 = require("../controllers/categorieController");
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../errors/errorHandler");
const mentorController_1 = require("../controllers/mentorController");
const notificationController_1 = require("../controllers/notificationController");
const path_1 = __importDefault(require("path"));
const paymentController_1 = require("../controllers/paymentController");
const reportsController_1 = require("../controllers/reportsController");
const taskController_1 = require("../controllers/taskController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//HTML
router.get("/users-reports", (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, "../", "views", "notifications.html"));
});
//Users
router.get("/users", userController_1.userController.getUsers);
router.post("/create-user", (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid"), userController_1.userController.createUser);
router.put("/update-user/:id", (0, errorRoute_1.checkIDParam)(user_1.default), userController_1.userController.updateUser);
router.put("/update-user-costs/:id", (0, errorRoute_1.checkIDParam)(user_1.default), userController_1.userController.updateUserCosts);
router.post("/user-health/:id", (0, errorRoute_1.checkIDParam)(user_1.default), userController_1.userController.getUserHealth);
//Mentor
router.get("/get-mentor/:id", mentorController_1.mentorController.getMentor);
router.post("/create-mentor", [(0, errorRoute_1.checkAlreadyMentored)(), (0, errorRoute_1.checkUserExist)(), (0, errorRoute_1.checkMentoringYourSelf)()], mentorController_1.mentorController.createMentor);
router.put("/update-mentor/:id", mentorController_1.mentorController.updateMentor);
router.delete("/delete-mentor/:id", mentorController_1.mentorController.deleteMentor);
//Tasks
router.get("/get-task/:id", (0, express_validator_1.param)("id"), taskController_1.taskController.getTasks);
router.post("/create-task", [(0, errorRoute_1.checkUserIDExist)()], taskController_1.taskController.createTask);
router.put("/update-task/:id", taskController_1.taskController.updateTask);
router.delete("/delete-task/:id", taskController_1.taskController.deleteTask);
//Notification
router.get("/get-notification/:id", notificationController_1.notificationController.getNotificationsByUserID);
router.post("/create-notification", (0, express_validator_1.body)("email").isEmail().withMessage("Email required"), notificationController_1.notificationController.createNotification);
router.put("/update-notification/:id", (0, express_validator_1.body)("isRead")
    .isBoolean()
    .withMessage("isRead need to be a boolean and it's required"), notificationController_1.notificationController.updateNotification);
router.delete("/delete-notifcation/:id", notificationController_1.notificationController.deleteNotification);
// Categories
router.get("/categories", categorieController_1.categorieController.getCategories);
router.post("/categories", categorieController_1.categorieController.createCategories);
// Achievements
router.post("/create-achievement", achievementController_1.achievementController.createAchievement);
router.get("/get-achievements/:userId", achievementController_1.achievementController.getAchievemnts);
//Payment
router.post("/create-checkout-session", paymentController_1.paymentController.checkoutSession);
//Reports
router.get("/report/verify-users", reportsController_1.reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController_1.reportsController.getAllUsersByCategorie);
//404
router.all("*", () => {
    throw new errorHandler_1.http404Error();
});
exports.default = router;
