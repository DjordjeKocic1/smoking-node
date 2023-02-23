import { NextFunction, Request, Response } from "express";

import { IUser } from "../types/types";
import User from "../model/user";
import { validationResult } from "express-validator";

const getUserHealth = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .then((user: any) => {
      return user
        .calculateHealth()
        .then((healthCalc: IUser) =>
          res.status(201).json({ user: healthCalc })
        );
    })
    .catch((err: any) => {
      console.log("Get Users Health Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createUser = (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err: any = new Error(
      "Validation failed, entered data is not correct!"
    );
    err.statusCode = 422;
    throw err; //thorw error will go to next error handling
  }
  const user = new User<IUser>({
    name: req.body.name,
    email: req.body.email,
    image: req.body.image,
    address: req.body.address,
    city: req.body.city,
  });
  User.find().then((users: IUser[]) => {
    let existingUser = users.find(
      (user: IUser) => user.email == req.body.email
    );
    if (!!existingUser) {
      return res.status(201).json({ user: existingUser });
    }
    user
      .save()
      .then((user: IUser) => {
        console.log({ "User Created": user });
        res.status(201).json({ user });
      })
      .catch((err: any) => {
        console.log("Create User Error:", err);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

const updateUser = (
  req: Request<{ id: string }, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      console.log({ "User Updated": user });
      res.status(201).json({ user });
    })
    .catch((err: any) => {
      console.log("Update User Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateUserCosts = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .then((user: any) => {
      user.calculateCosts(req.body).then((user: IUser) => {
        res.status(201).json({ user });
      });
    })
    .catch((err: any) => {
      console.log("Update User Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const userController = {
  getUserHealth,
  createUser,
  updateUser,
  updateUserCosts,
};
