import { body } from "express-validator";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { reportsController } from "../controllers/reportsController";
import { userController } from "../controllers/userController";

const router = exporess.Router();

//Users
router.post("/create-user", body("email").isEmail(), userController.createUser);

router.put("/update-user/:id", userController.updateUser);

router.put("/update-user-costs/:id", userController.updateUserCosts);

router.get("/user-health/:id", userController.getUserHealth);

// Categories
router.get("/categories", categorieController.getCategories);

router.post("/categories", categorieController.createCategories);

//Reports
router.get("/report/verify-users", reportsController.getAllVerifyUsers);

export default router;
