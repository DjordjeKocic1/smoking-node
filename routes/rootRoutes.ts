import { body, query } from "express-validator";
import {
  checkMentorIDExist,
  checkMentorIDParamExist,
  checkMentoringYourSelf,
  checkModelID,
  checkUserExist,
  checkUserIDExist,
  checkUserIdParamExist,
  checkUserRequestDeleteExist,
  checkUserRequestDeleteIDExist,
} from "../errors/errorRoute";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Plans from "../model/plans";
import Task from "../model/task";
import User from "../model/user";
import { achievementController } from "../controllers/achievementController";
import { categorieController } from "../controllers/categorieController";
import { emailController } from "../controllers/emailController";
import exporess from "express";
import { feedbackController } from "../controllers/feedbackController";
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
router.get("/existing/users", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "users.html"));
});
router.get("/account/delete/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views/account/", "login.html"));
});
router.get("/account/delete/request", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views/account/", "delete.html"));
});

//Users
router.get("/users", userController.getUsers);
router.post("/user", [checkUserExist()], userController.getUser);
router.post(
  "/user-info/:id",
  [checkModelID(User)],
  userController.getUserInfoCalc
);
router.post(
  "/create-user",
  body("email").isEmail().withMessage("Email is invalid"),
  userController.createUser
);
router.put("/update-user/:id", [checkModelID(User)], userController.updateUser);

router.delete(
  "/delete-user/:id",
  [checkModelID(User)],
  userController.deleteUser
);
router.post(
  "/user-token/:id",
  [checkModelID(User)],
  userController.getUserNotificationToken
);
router.post("/poke-user", userController.pokeUser);

//Plans
router.post(
  "/create-plan/:id",
  [checkModelID(User)],
  userController.createPlan
);
router.delete(
  "/delete-plan/:id",
  [checkModelID(Plans)],
  userController.deletePlan
);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    checkMentoringYourSelf(),
  ],
  mentorController.createMentor
);
router.put(
  "/update-mentor/:id",
  [checkModelID(Mentor)],
  mentorController.updateMentor
);
router.delete(
  "/delete-mentor/:mentorId/:userId",
  [checkMentorIDParamExist(), checkUserIdParamExist()],
  mentorController.deleteMentor
);

//Tasks
router.get("/get-task/:id", taskController.getTasks);
router.get(
  "/get-task/:userId/:mentorId",
  [checkMentorIDParamExist(), checkUserIdParamExist()],
  taskController.getTasksByMentor
);
router.post(
  "/create-task",
  [checkUserIDExist(), checkMentorIDExist()],
  taskController.createTask
);
router.put("/update-task/:id", [checkModelID(Task)], taskController.updateTask);
router.delete(
  "/delete-task/:id",
  [checkModelID(Task)],
  taskController.deleteTask
);

//Notification
router.get(
  "/get-notification/:id",
  notificationController.getNotificationsByUserID
);
router.post(
  "/create-notification",
  body("email").isEmail().withMessage("Email required"),
  notificationController.createNotification
);
router.put(
  "/update-notification/:userId",
  [checkUserIdParamExist()],
  notificationController.updateNotification
);
router.delete(
  "/delete-notifcation/:userId",
  [
    checkUserIdParamExist(),
    query("isTask").isString().withMessage("isTask query required"),
    query("isMentoring").isString().withMessage("isMentoring query required"),
  ],
  notificationController.deleteNotification
);

router.delete(
  "/delete-all-notifcation/:id",
  [checkModelID(Notification)],
  notificationController.deleteAllNotification
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
    res.redirect(
      `exp+istop://1doounm.djole232.19000.exp.direct?email=${req.user.email}`
    );
  }
);

//email
router.post("/email/create-email", emailController.createEmail);
router.post(
  "/email/create-delete-email",
  [checkUserRequestDeleteIDExist(), checkUserRequestDeleteExist()],
  emailController.createDeleteRequestEmail
);

//feedback
router.get("/get-feedback", feedbackController.getFeedbacks);
router.post(
  "/create-feedback",
  [checkUserExist()],
  feedbackController.createFeedback
);

//404
router.all("*", (req, res, next) => {
  throw new http404Error(`Requested url:'${req.url}' not found`);
});

export default router;
