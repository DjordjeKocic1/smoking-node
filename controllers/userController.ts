import { ICostsPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import User from "../model/user";
import { validationResult } from "express-validator";

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserHealth = (
  req: Request<{ id: string }, {}, { notificationToken: string }>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http500Error(errors.array()[0].msg);
  }
  User.findById(req.params.id)
    .then((user: any) => {
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
        return;
      }
      res.status(201).json({ user: healthCalc });
    })
    .catch((err) => {
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
    throw new http422Error(errors.array()[0].msg);
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
        res.status(201).json({ user });
      })
      .catch((err) => {
        next(err);
      });
  });
};

const updateUser = (
  req: Request<{ id: string }, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http500Error(errors.array()[0].msg);
  }
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserCosts = (
  req: Request<{ id: string }, {}, ICostsPayload>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http500Error(errors.array()[0].msg);
  }
  User.findById(req.params.id)
    .then((user: any) => {
      return user.calculateCosts(req.body);
    })
    .then((user: IUser) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
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
