import { ICostsPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import User from "../model/user";
import { validationResult } from "express-validator";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserHealth = async (
  req: Request<{ id: string }, {}, { notificationToken: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let user = (await User.findById(req.params.id)) as IUser;

    let healthCalc = await user.calculateHealth(user);

    if (!!req.body.notificationToken) {
      let userUpdate = (await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })) as IUser;
      res.status(201).json({
        user: {
          ...healthCalc.toObject(),
          notificationToken: userUpdate.notificationToken,
        },
      });
    }

    res.status(201).json({ user: healthCalc });
  } catch (error) {
    next(error);
  }
};

const createUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
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
    let users: IUser[] = await User.find();
    let existingUser = users.find(
      (user: IUser) => user.email == req.body.email
    );
    if (!!existingUser) {
      return res.status(201).json({ user: existingUser });
    }

    let userCreate: IUser = await user.save();
    res.status(201).json({ userCreate });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request<{ id: string }, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let user = (await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })) as IUser;
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUserCosts = async (
  req: Request<{ id: string }, {}, ICostsPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http500Error();
    }
    const user = (await User.findById(req.params.id)) as IUser;
    const userCost = await user.calculateCosts(req.body);
    res.status(201).json({ user: userCost });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getUsers,
  getUserHealth,
  createUser,
  updateUser,
  updateUserCosts,
};
