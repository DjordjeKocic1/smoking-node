import { body } from "express-validator";
import { categorieController } from "../controllers/categorieController";
import exporess from "express";
import { userController } from "../controllers/userController";

const router = exporess.Router();

//Users
router.get("/users", userController.getUsers);

router.post("/create-user", body("email").isEmail(), userController.createUser);

router.put("/update-user/:id", userController.updateUser);

router.post("/user-health/:id", userController.getUserHealth);

// Categories
router.get("/categories", categorieController.getCategories);

router.post("/categories", categorieController.createCategories);

export default router;
