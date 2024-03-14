import { body, query } from "express-validator";
import {
  checkMentor,
  checkModelID,
  checkSession,
  checkUser,
  validateRemoveAccountReq,
} from "../errors/errorRoute";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Plans from "../model/plans";
import Task from "../model/task";
import User from "../model/user";
import { achievementController } from "../controllers/achievementController";
import axios from "axios";
import { categorieController } from "../controllers/categorieController";
import { emailController } from "../controllers/emailController";
import exporess from "express";
import { facebookController } from "../controllers/facebookController";
import { feedbackController } from "../controllers/feedbackController";
import { http404Error } from "../errors/errorHandler";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import passport from "passport";
import path from "path";
import { paymentController } from "../controllers/stripeController";
import { paypalController } from "../controllers/paypalController";
import { planController } from "../controllers/planController";
import { reportsController } from "../controllers/reportsController";
import { taskController } from "../controllers/taskController";
import { userController } from "../controllers/userController";

require("dotenv").config();

const { FACEBOOK_APP_ID } = process.env;

const router = exporess.Router();

router.get("/account/delete/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views/account/", "login.html"));
});
router.get("/account/delete/request", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views/account/", "delete.html"));
});
router.get("/account/delete/success", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views/account/", "success.html"));
});
router.get("/account/registration/verification", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "views/account/", "verification.html")
  );
});
router.get(
  "/account/registration/generate-password?:token",
  (req, res, next) => {
    res.sendFile(
      path.join(__dirname, "../", "views/account/", "password.html")
    );
  }
);

//Users
router.get("/users", userController.getUsers);
router.post("/get-user-token", userController.getUserSession);
router.post("/user", [checkUser().checkUserEmail], userController.getUser);
router.post(
  "/user-info/:id",
  [checkModelID(User)],
  userController.updateUserConsumption
);
router.post(
  "/create-user",
  body("email").isEmail().withMessage("Email is invalid"),
  userController.createUser
);
router.post(
  "/create-user-with-token",
  [
    checkUser().checkUserRegistratedToken,
    checkUser().checkUserRegistratedPassword,
    body("email").isEmail().withMessage("Email is invalid"),
  ],
  userController.creatUserWithToken
);
router.post(
  "/user-login",
  [checkUser().checkUserEmail],
  userController.userLogin
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
  userController.updateUserNotificationToken
);
router.post("/poke-user", userController.pokeUser);

router.post("/send-notification", userController.sendNotification);

//Plans
router.post(
  "/create-plan/:id",
  [checkModelID(User)],
  planController.createPlan
);
router.delete(
  "/delete-plan/:id",
  [checkModelID(Plans)],
  planController.deletePlan
);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    checkMentor().checkMentoringYourSelf,
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
  [checkMentor().checkMentorIDParamExist, checkUser().checkUserParamIDExist],
  mentorController.deleteMentor
);

//Tasks
router.get("/get-task/:id", taskController.getTasks);
router.get(
  "/get-task/:userId/:mentorId",
  [checkMentor().checkMentorIDParamExist, checkUser().checkUserParamIDExist],
  taskController.getTasksByMentor
);
router.post(
  "/create-task",
  [checkUser().checkUserIDExist, checkMentor().checkMentorIDExist],
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
  [checkUser().checkUserParamIDExist],
  notificationController.updateNotification
);
router.delete(
  "/delete-notifcation/:userId",
  [
    checkUser().checkUserParamIDExist,
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
/* Google */
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

/* Facebook */
router.get("/auth/facebook", (req, res) => {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=https://istop.site/auth/facebook/callback&scope=email`;
  res.redirect(url);
});
router.get("/auth/facebook/callback", facebookController.login);

//email
router.post("/email/create-email", emailController.createEmail);
router.post(
  "/email/create-delete-email",
  [
    validateRemoveAccountReq().checkUserID,
    validateRemoveAccountReq().checkUserEmail,
    validateRemoveAccountReq().checkUserIdAndEmail,
    checkSession().checkParamEmail,
  ],
  emailController.createDeleteRequestEmail
);
router.post(
  "/email/create-email-verification",
  emailController.createEmailVerification
);

//feedback
router.get("/get-feedback", feedbackController.getFeedbacks);
router.post(
  "/create-feedback",
  [checkUser().checkUserEmail],
  feedbackController.createFeedback
);

//404
router.all("*", (req, res, next) => {
  throw new http404Error(`Requested url:'${req.url}' not found`);
});

export default router;
