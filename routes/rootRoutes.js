const exporess = require("express");
const userController = require("../controllers/userController");
const categorieController = require("../controllers/categorieController");
const { body } = require("express-validator");
const router = exporess.Router();

//Users
router.get("/users", userController.getUsers);

router.post("/create-user", body("email").isEmail(), userController.createUser);

router.put("/update-user/:id", userController.updateUser);

// router.put("/update-user-costs/:id", userController.updateUserCosts);

// Categories
router.get("/categories", categorieController.getCategories);

router.post("/categories", categorieController.createCategories);

module.exports = router;
