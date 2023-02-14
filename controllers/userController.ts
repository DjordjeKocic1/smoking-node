import User from "../model/user";
import { validationResult } from "express-validator";

const getUsers = (req: any, res: any) => {
  User.find().then((users: any) => {
    res.status(200).json({ users });
  });
};

const getUserHealth = (req: any, res: any, next: any) => {
  User.findById(req.params.id)
    .then((user: any) => {
      return user
        .calculateHealth(user)
        .then((healthCalc: any) => res.status(201).json({ user: healthCalc }));
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createUser = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err: any = new Error(
      "Validation failed, entered data is not correct!"
    );
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
  User.find().then((users: any) => {
    let existingUser = users.find((user: any) => user.email == req.body.email);
    if (!!existingUser) {
      return res.status(201).json({ user: existingUser });
    }
    user
      .save()
      .then((user: any) => {
        console.log({ "User Created": user });
        res.status(201).json({ user });
      })
      .catch((err: any) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

const updateUser = (req: any, res: any, next: any) => {
  if (req.body.consumptionInfo || req.body.savedInfo) {
    User.findById(req.params.id)
      .then((user: any) => {
        return user.calculateCosts(req.body);
      })
      .then((user: any) => {
        res.status(201).json({ user });
      })
      .catch((err: any) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user: any) => {
        console.log({ "User Updated": user });
        res.status(201).json({ user });
      })
      .catch((err: any) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

export const userController = {
  getUsers,
  getUserHealth,
  createUser,
  updateUser,
};
