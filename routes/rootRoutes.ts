import {
  checkAlreadyMentored,
  checkMentoringYourSelf,
  checkUserExist,
  checkUserIDExist,
} from "../errors/errorHelper";

import { achievementController } from "../controllers/achievementController";
import { body } from "express-validator";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import { reportsController } from "../controllers/reportsController";
import { taskController } from "../controllers/taskController";
import { userController } from "../controllers/userController";

const path = require("path");
const router = exporess.Router();

//HTML
router.get("/users-reports", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "notifications.html"));
});

//Users
router.get("/users", userController.getUsers);
router.post("/create-user", body("email").isEmail(), userController.createUser);
router.put("/update-user/:id", userController.updateUser);
router.put("/update-user-costs/:id", userController.updateUserCosts);
router.get("/user-health/:id", userController.getUserHealth);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [
    checkAlreadyMentored("You already send request"),
    checkUserExist("This mentor user doesn't exist"),
    checkMentoringYourSelf("You can not mentor your self"),
  ],
  mentorController.createMentor
);
router.put("/update-mentor/:id", mentorController.updateMentor);
router.delete("/delete-mentor/:id", mentorController.deleteMentor);

//Tasks
router.get("/get-task/:id", taskController.getTasks);
router.post(
  "/create-task",
  [
    body("userId")
      .isLength({ min: 12, max: 24 })
      .withMessage("Must be at least 12 and max 24 chars"),
    body("mentorId")
      .isLength({ min: 12, max: 24 })
      .withMessage("Must be at least 12 and max 24 chars"),
    checkUserIDExist("User of that ID doesnt exists"),
  ],
  taskController.createTask
);
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

export default router;
