const User = require("../model/user");
const moment = require("moment");
const { validationResult } = require("express-validator");
exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.status(200).json({ users });
  });
};

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed, entered data is not correct!");
    err.statusCode = 422;
    throw err; //thorw error will go to next error handling
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.body.picture,
    address: req.body.address,
    city: req.body.city,
  });
  User.find().then((users) => {
    let existingUser = users.find((user) => user.email == req.body.email);
    if (!!existingUser) {
      return res.status(201).json({ user: existingUser });
    }
    user
      .save()
      .then((user) => {
        console.log({ "User Created": user });
        res.status(201).json({ user });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.updateUser = (req, res, next) => {
  if (req.body.consumptionInfo || req.body.savedInfo) {
    User.findById(req.params.id)
      .then((user) => {
        return user.calculateCosts(req.body);
      })
      .then((user) => {
        res.status(201).json({ user });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => {
        console.log({ "User Updated": user });
        res.status(201).json({ user });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
