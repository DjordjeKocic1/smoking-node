import {
  checkExistMentoring,
  checkExistUserEmail,
  checkMentoringYourSelf,
  checkUserIDExist,
} from "../errors/errorHelper";

import { body } from "express-validator";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { mentorController } from "../controllers/mentorController";
import { notificationController } from "../controllers/notificationController";
import { reportsController } from "../controllers/reportsController";
import { taskController } from "../controllers/taskController";
import { userController } from "../controllers/userController";

const router = exporess.Router();

//Users
router.post("/create-user", body("email").isEmail(), userController.createUser);
router.put("/update-user/:id", userController.updateUser);
router.put("/update-user-costs/:id", userController.updateUserCosts);
router.get("/user-health/:id", userController.getUserHealth);

//Mentor
router.get("/get-mentor/:id", mentorController.getMentor);
router.post(
  "/create-mentor",
  [
    checkExistMentoring("You already mentoring"),
    checkExistUserEmail("This user doesnt exist"),
    checkMentoringYourSelf("You can not mentor your self"),
  ],
  mentorController.createMentor
);
router.put("/update-mentor/:id", mentorController.updateMentor);

//Tasks
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

//Notification
router.post(
  "/create-notification",
  body("userId").isString().withMessage("UserId required"),
  notificationController.createNotification
);

router.put(
  "/update-notification/:id",
  body("isRead")
    .isBoolean()
    .withMessage("isRead need to be a boolean and it's required"),
  notificationController.updateNotification
);

// Categories
router.get("/categories", categorieController.getCategories);
router.post("/categories", categorieController.createCategories);

//Reports
router.get("/report/verify-users", reportsController.getAllVerifyUsers);
router.get("/report/categorie/:name", reportsController.getAllUsersByCategorie);

export default router;
