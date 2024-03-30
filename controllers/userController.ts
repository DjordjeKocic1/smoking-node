import { IParams, IUser } from "../types/types";

import Mentor from "../model/mentor";
import { RequestHandler } from "express";
import User from "../model/user";
import bcryprt from "bcryptjs";
import { expoNotification } from "../helpers/notifications/notifications";
import { http422Error } from "../errors/errorHandler";
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";

const getUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    let user = (await User.findOne({ email: req.body.email })) as IUser;
    res
      .status(200)
      .json({ user, redirect: "/account/delete/request?id=" + user._id });
  } catch (error) {
    next(error);
  }
};

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    let users = await User.find();
    res.status(200).json({ users });
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

    let existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        address: req.body.address,
        city: req.body.city,
      });
      let userCreate = await user.save();
      res.status(201).json({ user: userCreate });
      return;
    }

    res.status(201).json({ user: existingUser });
  } catch (error) {
    next(error);
  }
};

const creatUserWithPassword: RequestHandler<{}, {}, IUser> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let token = jwt.decode(req.body.token) as { email: string };
    let email = token.email;
    

    let password = await bcryprt.hash(req.body.password.replace(" ", ""), 12);
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      const user = new User({
        email,
      });
      user.password = password;
      let userCreate = await user.save();
      res.status(201).json({ user: userCreate });
      return;
    }

    existingUser.password = password;
    await existingUser.save();
    res.status(201).json({ user: existingUser });
  } catch (error) {
    next(error);
  }
};

const userLogin: RequestHandler<
  {},
  {},
  { email: string; password: string }
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let userFind = (await User.findOne({ email: req.body.email })) as IUser;

    let passwordCompare = await bcryprt.compare(
      req.body.password,
      userFind.password
    );

    if (!passwordCompare) {
      throw new http422Error("Wrong password");
    }

    res.status(201).json({ user: userFind });
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

const deleteUser: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    await User.findOneAndDelete({ _id: req.params.id });

    let mentorDeleteId = await Mentor.findOne({ userId: req.params.id });

    if (mentorDeleteId) {
      await mentorDeleteId.remove();
    }

    let mentors = await Mentor.find();

    for (const mentor of mentors) {
      let findMentoringUser = mentor.mentoringUser.find(
        (m) => m._id?.toString() === req.params.id
      );
      if (findMentoringUser) {
        let filtered = mentor.mentoringUser.filter(
          (m) => m._id?.toString() !== findMentoringUser?._id?.toString()
        );
        mentor.mentoringUser = filtered;
        await mentor.save();
      }
    }

    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

const updateUserNotificationToken: RequestHandler<
  IParams,
  {},
  { notificationToken: string }
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let userUpdate = (await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })) as IUser;

    res.status(201).json({ user: userUpdate });
  } catch (error) {
    next(error);
  }
};

const updateUserConsumption: RequestHandler<IParams, {}> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let user = (await User.findById(req.params.id)) as IUser;

    let userInfoCalc;

    if (!req.body.consumptionInfo) {
      userInfoCalc = await user.calculateHealth(user, user.consumptionInfo);
    } else {
      userInfoCalc = await user.calculateHealth(user, req.body);
    }

    res.status(201).json({ user: userInfoCalc });
  } catch (error) {
    next(error);
  }
};

const pokeUser: RequestHandler<
  {},
  {},
  { notificationToken: string; name: string }
> = async (req, res, next) => {
  try {
    await expoNotification.sendPushNotification({
      to: req.body.notificationToken,
      title: `Poked by ${req.body.name}`,
      body: "You just received a poke from mentor 👈",
    });

    res.status(201).json({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

const sendNotification: RequestHandler<
  {},
  {},
  { notificationToken: string; title: string; body: string }
> = async (req, res, next) => {
  try {
    await expoNotification.sendPushNotification({
      to: req.body.notificationToken,
      title: req.body.title,
      body: req.body.body,
    });

    res.status(201).json({ success: "ok" });
  } catch (error) {
    next(error);
  }
};


export const userController = {
  getUsers,
  getUser,
  updateUserConsumption,
  createUser,
  creatUserWithPassword,
  userLogin,
  updateUser,
  deleteUser,
  pokeUser,
  sendNotification,
  updateUserNotificationToken,
};
