"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHelper_1 = require("../errors/errorHelper");
const achievementController_1 = require("../controllers/achievementController");
const express_validator_1 = require("express-validator");
const categorieController_1 = require("../controllers/categorieController");
const express_1 = __importDefault(require("express"));
const mentorController_1 = require("../controllers/mentorController");
const notificationController_1 = require("../controllers/notificationController");
const reportsController_1 = require("../controllers/reportsController");
const taskController_1 = require("../controllers/taskController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//Users
router.post("/create-user", (0, express_validator_1.body)("email").isEmail(), userController_1.userController.createUser);
router.put("/update-user/:id", userController_1.userController.updateUser);
router.put("/update-user-costs/:id", userController_1.userController.updateUserCosts);
router.get("/user-health/:id", userController_1.userController.getUserHealth);
//Mentor
router.get("/get-mentor/:id", mentorController_1.mentorController.getMentor);
router.post("/create-mentor", [
    (0, errorHelper_1.checkAlreadyMentored)("You already send request"),
    (0, errorHelper_1.checkUserExist)("This mentor user doesn't exist"),
    (0, errorHelper_1.checkMentoringYourSelf)("You can not mentor your self"),
], mentorController_1.mentorController.createMentor);
router.put("/update-mentor/:id", mentorController_1.mentorController.updateMentor);
router.delete("/delete-mentor/:id", mentorController_1.mentorController.deleteMentor);
//Tasks
router.get("/get-task/:id", taskController_1.taskController.getTasks);
router.post("/create-task", [
    (0, express_validator_1.body)("userId")
        .isLength({ min: 12, max: 24 })
        .withMessage("Must be at least 12 and max 24 chars"),
    (0, express_validator_1.body)("mentorId")
        .isLength({ min: 12, max: 24 })
        .withMessage("Must be at least 12 and max 24 chars"),
    (0, errorHelper_1.checkUserIDExist)("User of that ID doesnt exists"),
], taskController_1.taskController.createTask);
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
router.get("/get-achievements", achievementController_1.achievementController.getAchievemnts);
//Reports
router.get("/report/verify-users", reportsController_1.reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController_1.reportsController.getAllUsersByCategorie);
exports.default = router;
