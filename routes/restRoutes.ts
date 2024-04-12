import { body, query } from "express-validator";
import {
  checkMentor,
  checkModelID,
  checkUser,
  validateRemoveAccountReq,
} from "../errors/errorRoute";
import { verifyHeaderToken, verifyHeaderTokenAdmin } from "../errors/auth";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Plans from "../model/plans";
import { Router } from "express";
import Task from "../model/task";
import User from "../model/user";
import { achievementController } from "../controllers/achievementController";
import { categorieController } from "../controllers/categorieController";
import { emailController } from "../controllers/emailController";
import { feedbackController } from "../controllers/feedbackController";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import passport from "passport";
import { paymentController } from "../controllers/stripeController";
import { paypalController } from "../controllers/paypalController";
import { planController } from "../controllers/planController";
import { taskController } from "../controllers/taskController";
import { userController } from "../controllers/userController";

export const adminRoutes = (router: Router) => {
  router.post(
    "/admin-login",
    [checkUser().checkUserAdmin],
    userController.userLogin
  );
  router.get(
    "/admin-users",
    [verifyHeaderToken, verifyHeaderTokenAdmin],
    userController.getUsers
  );
};

export const userRoutes = (router: Router) => {
  router.post(
    "/user-login",
    [checkUser().checkUserEmail],
    userController.userLogin
  );
  router.get("/users", verifyHeaderToken, userController.getUsers);
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
    "/create-user-with-password",
    [verifyHeaderToken, checkUser().checkUserRegistratedPassword],
    userController.creatUserWithPassword
  );
  router.put(
    "/update-user/:id",
    [checkModelID(User)],
    userController.updateUser
  );
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
};

export const plansRoutes = (router: Router) => {
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
};

export const mentorRoutes = (router: Router) => {
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
};

export const taskRoutes = (router: Router) => {
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
  router.put(
    "/update-task/:id",
    [checkModelID(Task)],
    taskController.updateTask
  );
  router.delete(
    "/delete-task/:id",
    [checkModelID(Task)],
    taskController.deleteTask
  );
};

export const notificationRoutes = (router: Router) => {
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
};

export const categorieRoutes = (router: Router) => {
  router.get("/categories", categorieController.getCategories);
  router.post("/categories", categorieController.createCategories);
};

export const achievementRoutes = (router: Router) => {
  router.post("/create-achievement", achievementController.createAchievement);
  router.get(
    "/get-achievements/:id",
    checkModelID(User),
    achievementController.getAchievemnts
  );
};

export const paymentRoutes = (router: Router) => {
  router.get("/fetch-key", paymentController.keyGetStripe);
  router.post("/payment-sheet", paymentController.paymentSheet);
  router.post("/paypal-pay", paypalController.paypalPay);
  router.get("/success", paypalController.paypalSuccess);
  router.get("/cancel", paypalController.paypalCancel);
};

export const emailRoutes = (router: Router) => {
  router.post("/email/create-email", emailController.createEmail);
  router.post(
    "/email/create-delete-email",
    [
      validateRemoveAccountReq().checkUserID,
      validateRemoveAccountReq().checkUserEmail,
      validateRemoveAccountReq().checkUserIdAndEmail,
    ],
    emailController.createDeleteRequestEmail
  );
  router.post(
    "/email/create-email-verification",
    emailController.createEmailVerification
  );
};

export const feedbackRoutes = (router: Router) => {
  router.get("/get-feedback", feedbackController.getFeedbacks);
  router.post(
    "/create-feedback",
    [checkUser().checkUserEmail],
    feedbackController.createFeedback
  );
};

export const authorizationRoutes = (router: Router) => {
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

  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["public_profile", "email"],
    })
  );
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth/facebook" }),
    (req: any, res) => {
      res.redirect(
        `exp+istop://1doounm.djole232.19000.exp.direct?email=${req.user.email}`
      );
    }
  );
};
