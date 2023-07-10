import {
  checkAlreadyMentored,
  checkIdParams,
  checkMentoringYourSelf,
  checkModelID,
  checkUserExist,
  checkUserIDExist,
} from "../errors/errorRoute";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
import { achievementController } from "../controllers/achievementController";
import { body } from "express-validator";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { http404Error } from "../errors/errorHandler";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import passport from "passport";
import path from "path";
import { paymentController } from "../controllers/stripeController";
import { paypalController } from "../controllers/paypalController";
import { reportsController } from "../controllers/reportsController";
import { taskController } from "../controllers/taskController";
import { userController } from "../controllers/userController";

const router = exporess.Router();

//HTML
router.get("/users-reports", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "notifications.html"));
});

//Users
router.get("/users", userController.getUsers);
router.post(
  "/user-health/:id",
  [checkIdParams(), checkModelID(User)],
  userController.getUserHealth
);
router.post(
  "/create-user",
  body("email").isEmail().withMessage("Email is invalid"),
  userController.createUser
);
router.put(
  "/update-user/:id",
  [checkIdParams(), checkModelID(User)],
  userController.updateUser
);
router.put(
  "/update-user-costs/:id",
  [checkIdParams(), checkModelID(User)],
  userController.updateUserCosts
);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [checkAlreadyMentored(), checkUserExist(), checkMentoringYourSelf()],
  mentorController.createMentor
);
router.put(
  "/update-mentor/:id",
  [checkIdParams(), checkModelID(Mentor)],
  mentorController.updateMentor
);
router.delete(
  "/delete-mentor/:id",
  [checkIdParams(), checkModelID(Mentor)],
  mentorController.deleteMentor
);

//Tasks
router.get("/get-task/:id", checkIdParams(), taskController.getTasks);
router.post("/create-task", checkUserIDExist(), taskController.createTask);
router.put(
  "/update-task/:id",
  [checkIdParams(), checkModelID(Task)],
  taskController.updateTask
);
router.delete(
  "/delete-task/:id",
  [checkIdParams(), checkModelID(Task)],
  taskController.deleteTask
);

//Notification
router.get(
  "/get-notification/:id",
  checkIdParams(),
  notificationController.getNotificationsByUserID
);
router.post(
  "/create-notification",
  body("email").isEmail().withMessage("Email required"),
  notificationController.createNotification
);
router.put(
  "/update-notification/:id",
  [checkIdParams(), checkModelID(Notification)],
  notificationController.updateNotification
);
router.delete(
  "/delete-notifcation/:id",
  [checkIdParams(), checkModelID(Notification)],
  notificationController.deleteNotification
);

// Categories
router.get("/categories", categorieController.getCategories);
router.post("/categories", categorieController.createCategories);

// Achievements
router.post("/create-achievement", achievementController.createAchievement);
router.get(
  "/get-achievements/:id",
  checkModelID(User),
  achievementController.getAchievemnts
);

//Payment
router.get("/fetch-key", paymentController.keyGetStripe);
router.post("/payment-sheet", paymentController.paymentSheet);
router.post("/paypal-pay", paypalController.paypalPay);
router.get("/success", paypalController.paypalSuccess);
router.get("/cancel", paypalController.paypalCancel);

//Reports
router.get("/report/verify-users", reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController.getAllUsersByCategorie);

//Authenticate
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  (req: any, res) => {
    res.redirect(`exp://192.168.0.11:19000/?email=${req.user.email}`);
  }
);

//404
router.all("*", () => {
  throw new http404Error();
});

export default router;
