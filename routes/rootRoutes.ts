import { body, param } from "express-validator";
import {
  checkAlreadyMentored,
  checkIDParam,
  checkMentoringYourSelf,
  checkUserExist,
  checkUserIDExist,
} from "../errors/errorRoute";

import User from "../model/user";
import { achievementController } from "../controllers/achievementController";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { http404Error } from "../errors/errorHandler";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import path from "path";
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
  "/create-user",
  body("email").isEmail().withMessage("Email is invalid"),
  userController.createUser
);
router.put("/update-user/:id", checkIDParam(User), userController.updateUser);
router.put(
  "/update-user-costs/:id",
  checkIDParam(User),
  userController.updateUserCosts
);
router.get(
  "/user-health/:id",
  checkIDParam(User),
  userController.getUserHealth
);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [checkAlreadyMentored(), checkUserExist(), checkMentoringYourSelf()],
  mentorController.createMentor
);
router.put("/update-mentor/:id", mentorController.updateMentor);
router.delete("/delete-mentor/:id", mentorController.deleteMentor);

//Tasks
router.get("/get-task/:id", param("id"), taskController.getTasks);
router.post("/create-task", [checkUserIDExist()], taskController.createTask);
router.put("/update-task/:id", taskController.updateTask);
router.delete("/delete-task/:id", taskController.deleteTask);

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
  "/update-notification/:id",
  body("isRead")
    .isBoolean()
    .withMessage("isRead need to be a boolean and it's required"),
  notificationController.updateNotification
);
router.delete(
  "/delete-notifcation/:id",
  notificationController.deleteNotification
);
// Categories
router.get("/categories", categorieController.getCategories);
router.post("/categories", categorieController.createCategories);

// Achievements
router.post("/create-achievement", achievementController.createAchievement);
router.get("/get-achievements/:userId", achievementController.getAchievemnts);

//Reports
router.get("/report/verify-users", reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController.getAllUsersByCategorie);

//404
router.all("*", () => {
  throw new http404Error();
});

export default router;
