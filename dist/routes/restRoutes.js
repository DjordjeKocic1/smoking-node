"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationRoutes = exports.feedbackRoutes = exports.emailRoutes = exports.paymentRoutes = exports.achievementRoutes = exports.categorieRoutes = exports.notificationRoutes = exports.taskRoutes = exports.mentorRoutes = exports.plansRoutes = exports.userRoutes = exports.adminRoutes = void 0;
const express_validator_1 = require("express-validator");
const errorRoute_1 = require("../errors/errorRoute");
const auth_1 = require("../errors/auth");
const mentor_1 = __importDefault(require("../model/mentor"));
const notification_1 = __importDefault(require("../model/notification"));
const plans_1 = __importDefault(require("../model/plans"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const achievementController_1 = require("../controllers/achievementController");
const categorieController_1 = require("../controllers/categorieController");
const emailController_1 = require("../controllers/emailController");
const feedbackController_1 = require("../controllers/feedbackController");
const mentorController_1 = require("../controllers/mentorController");
const notificationController_1 = require("../controllers/notificationController");
const passport_1 = __importDefault(require("passport"));
const stripeController_1 = require("../controllers/stripeController");
const paypalController_1 = require("../controllers/paypalController");
const planController_1 = require("../controllers/planController");
const taskController_1 = require("../controllers/taskController");
const userController_1 = require("../controllers/userController");
const adminRoutes = (router) => {
    router.post("/admin-login", [(0, errorRoute_1.checkUser)().checkUserAdmin], userController_1.userController.userLogin);
    router.get("/admin-users", [auth_1.verifyHeaderToken, auth_1.verifyHeaderTokenAdmin], userController_1.userController.getUsers);
};
exports.adminRoutes = adminRoutes;
const userRoutes = (router) => {
    router.post("/user-login", [(0, errorRoute_1.checkUser)().checkUserEmail], userController_1.userController.userLogin);
    router.get("/users", auth_1.verifyHeaderToken, userController_1.userController.getUsers);
    router.post("/user", [(0, errorRoute_1.checkUser)().checkUserEmail], userController_1.userController.getUser);
    router.post("/user-info/:id", [(0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.updateUserConsumption);
    router.post("/create-user", (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid"), userController_1.userController.createUser);
    router.post("/create-user-with-password", [auth_1.verifyHeaderToken, (0, errorRoute_1.checkUser)().checkUserRegistratedPassword], userController_1.userController.creatUserWithPassword);
    router.put("/update-user/:id", [(0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.updateUser);
    router.delete("/delete-user/:id", [(0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.deleteUser);
    router.post("/user-token/:id", [(0, errorRoute_1.checkModelID)(user_1.default)], userController_1.userController.updateUserNotificationToken);
    router.post("/poke-user", userController_1.userController.pokeUser);
    router.post("/send-notification", userController_1.userController.sendNotification);
};
exports.userRoutes = userRoutes;
const plansRoutes = (router) => {
    router.post("/create-plan/:id", [(0, errorRoute_1.checkModelID)(user_1.default)], planController_1.planController.createPlan);
    router.delete("/delete-plan/:id", [(0, errorRoute_1.checkModelID)(plans_1.default)], planController_1.planController.deletePlan);
};
exports.plansRoutes = plansRoutes;
const mentorRoutes = (router) => {
    router.get("/get-mentor/:id", mentorController_1.mentorController.getMentor);
    router.post("/create-mentor", [
        (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid"),
        (0, errorRoute_1.checkMentor)().checkMentoringYourSelf,
    ], mentorController_1.mentorController.createMentor);
    router.put("/update-mentor/:id", [(0, errorRoute_1.checkModelID)(mentor_1.default)], mentorController_1.mentorController.updateMentor);
    router.delete("/delete-mentor/:mentorId/:userId", [(0, errorRoute_1.checkMentor)().checkMentorIDParamExist, (0, errorRoute_1.checkUser)().checkUserParamIDExist], mentorController_1.mentorController.deleteMentor);
};
exports.mentorRoutes = mentorRoutes;
const taskRoutes = (router) => {
    router.get("/get-task/:id", taskController_1.taskController.getTasks);
    router.get("/get-task/:userId/:mentorId", [(0, errorRoute_1.checkMentor)().checkMentorIDParamExist, (0, errorRoute_1.checkUser)().checkUserParamIDExist], taskController_1.taskController.getTasksByMentor);
    router.post("/create-task", [(0, errorRoute_1.checkUser)().checkUserIDExist, (0, errorRoute_1.checkMentor)().checkMentorIDExist], taskController_1.taskController.createTask);
    router.put("/update-task/:id", [(0, errorRoute_1.checkModelID)(task_1.default)], taskController_1.taskController.updateTask);
    router.delete("/delete-task/:id", [(0, errorRoute_1.checkModelID)(task_1.default)], taskController_1.taskController.deleteTask);
};
exports.taskRoutes = taskRoutes;
const notificationRoutes = (router) => {
    router.get("/get-notification/:id", notificationController_1.notificationController.getNotificationsByUserID);
    router.post("/create-notification", (0, express_validator_1.body)("email").isEmail().withMessage("Email required"), notificationController_1.notificationController.createNotification);
    router.put("/update-notification/:userId", [(0, errorRoute_1.checkUser)().checkUserParamIDExist], notificationController_1.notificationController.updateNotification);
    router.delete("/delete-notifcation/:userId", [
        (0, errorRoute_1.checkUser)().checkUserParamIDExist,
        (0, express_validator_1.query)("isTask").isString().withMessage("isTask query required"),
        (0, express_validator_1.query)("isMentoring").isString().withMessage("isMentoring query required"),
    ], notificationController_1.notificationController.deleteNotification);
    router.delete("/delete-all-notifcation/:id", [(0, errorRoute_1.checkModelID)(notification_1.default)], notificationController_1.notificationController.deleteAllNotification);
};
exports.notificationRoutes = notificationRoutes;
const categorieRoutes = (router) => {
    router.get("/categories", categorieController_1.categorieController.getCategories);
    router.post("/categories", categorieController_1.categorieController.createCategories);
};
exports.categorieRoutes = categorieRoutes;
const achievementRoutes = (router) => {
    router.post("/create-achievement", achievementController_1.achievementController.createAchievement);
    router.get("/get-achievements/:id", (0, errorRoute_1.checkModelID)(user_1.default), achievementController_1.achievementController.getAchievemnts);
};
exports.achievementRoutes = achievementRoutes;
const paymentRoutes = (router) => {
    router.get("/fetch-key", stripeController_1.paymentController.keyGetStripe);
    router.post("/payment-sheet", stripeController_1.paymentController.paymentSheet);
    router.post("/paypal-pay", paypalController_1.paypalController.paypalPay);
    router.get("/success", paypalController_1.paypalController.paypalSuccess);
    router.get("/cancel", paypalController_1.paypalController.paypalCancel);
};
exports.paymentRoutes = paymentRoutes;
const emailRoutes = (router) => {
    router.post("/email/create-email", emailController_1.emailController.createEmail);
    router.post("/email/create-delete-email", [
        (0, errorRoute_1.validateRemoveAccountReq)().checkUserID,
        (0, errorRoute_1.validateRemoveAccountReq)().checkUserEmail,
        (0, errorRoute_1.validateRemoveAccountReq)().checkUserIdAndEmail,
    ], emailController_1.emailController.createDeleteRequestEmail);
    router.post("/email/create-email-verification", emailController_1.emailController.createEmailVerification);
};
exports.emailRoutes = emailRoutes;
const feedbackRoutes = (router) => {
    router.get("/get-feedback", feedbackController_1.feedbackController.getFeedbacks);
    router.post("/create-feedback", [(0, errorRoute_1.checkUser)().checkUserEmail], feedbackController_1.feedbackController.createFeedback);
};
exports.feedbackRoutes = feedbackRoutes;
const authorizationRoutes = (router) => {
    router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
    router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/google" }), (req, res) => {
        res.redirect(`exp+istop://1doounm.djole232.19000.exp.direct?email=${req.user.email}`);
    });
    router.get("/auth/facebook", passport_1.default.authenticate("facebook", {
        scope: ["public_profile", "email"],
    }));
    router.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/auth/facebook" }), (req, res) => {
        res.redirect(`exp+istop://1doounm.djole232.19000.exp.direct?email=${req.user.email}`);
    });
};
exports.authorizationRoutes = authorizationRoutes;
