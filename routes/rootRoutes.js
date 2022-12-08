const exporess = require("express");
const User = require("../model/user");
const userController = require("../controllers/userController");
const router = exporess.Router();

router.get("/users", userController.getUsers);

router.post("/create-user", userController.createUser);

router.put("/update-user/:id", userController.updateUser);

module.exports = router;
