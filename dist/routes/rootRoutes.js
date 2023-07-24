"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRoute_1 = require("../errors/errorRoute");
const mentor_1 = __importDefault(require("../model/mentor"));
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const achievementController_1 = require("../controllers/achievementController");
const express_validator_1 = require("express-validator");
const categorieController_1 = require("../controllers/categorieController");
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../errors/errorHandler");
const mentorController_1 = require("../controllers/mentorController");
const notificationController_1 = require("../controllers/notificationController");
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const stripeController_1 = require("../controllers/stripeController");
const paypalController_1 = require("../controllers/paypalController");
const reportsController_1 = require("../controllers/reportsController");
const taskController_1 = require("../controllers/taskController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//HTML
router.get("/", (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, "../", "views", "notifications.html"));
});
//Users
router.get("/users", userController_1.userController.getUsers);
router.post("/user-health/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.getUserHealth);
router.post("/create-user", (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid").normalizeEmail(), userController_1.userController.createUser);
router.put("/update-user/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.updateUser);
router.put("/update-user-costs/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.updateUserCosts);
//Mentor
router.get("/get-mentor/:id", (0, errorRoute_1.checkIdParams)(), mentorController_1.mentorController.getMentor);
router.post("/create-mentor", [(0, errorRoute_1.checkAlreadyMentored)(), (0, errorRoute_1.checkUserExist)(), (0, errorRoute_1.checkMentoringYourSelf)()], mentorController_1.mentorController.createMentor);
router.put("/update-mentor/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(mentor_1.default)], mentorController_1.mentorController.updateMentor);
router.delete("/delete-mentor/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(mentor_1.default)], mentorController_1.mentorController.deleteMentor);
//Tasks
router.get("/get-task/:id", (0, errorRoute_1.checkIdParams)(), taskController_1.taskController.getTasks);
router.post("/create-task", [(0, errorRoute_1.checkUserIDExist)(), (0, errorRoute_1.checkMentorIDExist)()], taskController_1.taskController.createTask);
router.put("/update-task/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(task_1.default)], taskController_1.taskController.updateTask);
router.delete("/delete-task/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(task_1.default)], taskController_1.taskController.deleteTask);
//Notification
router.get("/get-notification/:id", (0, errorRoute_1.checkIdParams)(), notificationController_1.notificationController.getNotificationsByUserID);
router.post("/create-notification", (0, express_validator_1.body)("email").isEmail().withMessage("Email required"), notificationController_1.notificationController.createNotification);
router.put("/update-notification/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(notification_1.default)], notificationController_1.notificationController.updateNotification);
router.delete("/delete-notifcation/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(notification_1.default)], notificationController_1.notificationController.deleteNotification);
router.delete("/delete-all-notifcation/:id", [(0, errorRoute_1.checkIdParams)(), (0, errorRoute_1.checkModelID)(notification_1.default)], notificationController_1.notificationController.deleteAllNotification);
// Categories
router.get("/categories", categorieController_1.categorieController.getCategories);
router.post("/categories", categorieController_1.categorieController.createCategories);
// Achievements
router.post("/create-achievement", achievementController_1.achievementController.createAchievement);
router.get("/get-achievements/:id", (0, errorRoute_1.checkModelID)(user_1.default), achievementController_1.achievementController.getAchievemnts);
//Payment
router.get("/fetch-key", stripeController_1.paymentController.keyGetStripe);
router.post("/payment-sheet", stripeController_1.paymentController.paymentSheet);
router.post("/paypal-pay", paypalController_1.paypalController.paypalPay);
router.get("/success", paypalController_1.paypalController.paypalSuccess);
router.get("/cancel", paypalController_1.paypalController.paypalCancel);
//Reports
router.get("/report/verify-users", reportsController_1.reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController_1.reportsController.getAllUsersByCategorie);
//Authenticate
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/google" }), (req, res) => {
    res.redirect(`exp://192.168.0.11:19000/?email=${req.user.email}`);
});
//404
router.all("*", () => {
    throw new errorHandler_1.http404Error();
});
exports.default = router;
