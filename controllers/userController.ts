import { ICostsPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";

import User from "../model/user";
import { validationResult } from "express-validator";

const getUsers = (req: Request, res: Response) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      console.log("users Get Error:", error);
      res.status(502).json({ error });
    });
};

const getUserHealth = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .then((user: any) => {
      if (!user) {
        const error: any = new Error("User not found");
        error.statusCode = 422;
        throw error;
      }
      return user.calculateHealth(user);
    })
    .then((healthCalc: any) => {
      if (!!req.body.notificationToken) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
          (data: any) => {
            res.status(201).json({
              user: {
                ...healthCalc._doc,
                notificationToken: data.notificationToken,
              },
            });
          }
        );
      } else {
        res.status(201).json({ user: healthCalc });
      }
    })
    .catch((err: any) => {
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
    const err: any = new Error(errors.array()[0].msg)
    err.statusCode = 422;
    throw err; //thorw error will go to next error handling
  }
  const user = new User({
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

const updateUserCosts = (
  req: Request<{ id: string }, {}, ICostsPayload>,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .then((user: any) => {
      return user.calculateCosts(req.body);
    })
    .then((user: IUser) => {
      console.log("User Costs Updated", user);
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

export const userController = {
  getUsers,
  getUserHealth,
  createUser,
  updateUser,
  updateUserCosts,
};
