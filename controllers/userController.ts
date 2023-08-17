import { IConsumationPayload, IParams, IUser } from "../types/types";
import { http422Error, http500Error } from "../errors/errorHandler";

import Mentor from "../model/mentor";
import { RequestHandler } from "express";
import User from "../model/user";
import { validationResult } from "express-validator";

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    let users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserHealth: RequestHandler<
  IParams,
  {},
  { notificationToken: string }
> = async (req, res, next) => {
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
      return res.status(201).json({
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

const createUser: RequestHandler<{}, {}, IUser> = async (req, res, next) => {
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

    let users = await User.find();

    let existingUser = users.find((user) => user.email == req.body.email);

    if (!!existingUser) {
      return res.status(201).json({ user: existingUser });
    }

    let userCreate = await user.save();
    res.status(201).json({ user: userCreate });
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler<IParams> = async (req, res, next) => {
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

const updateUserCosts: RequestHandler<
  IParams,
  {},
  IConsumationPayload
> = async (req, res, next) => {
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

const deleteUser: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let userDeleted = await User.findByIdAndDelete({ _id: req.params.id });

    await Mentor.findByIdAndDelete({ mentorId: userDeleted?._id });

    res.status(204).send({ success: "ok" });
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
  deleteUser,
};
