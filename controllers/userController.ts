import { IConsumationPayload, IParams, IPlans, IUser } from "../types/types";
import { http422Error, http500Error } from "../errors/errorHandler";

import Mentor from "../model/mentor";
import Plans from "../model/plans";
import { RequestHandler } from "express";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
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

const createPlan: RequestHandler<IParams, {}, IPlans> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let plan = new Plans({
      name: req.body.name,
      completed: false,
      userId: req.params.id,
    });

    let planExist = await Plans.findOne({ name: req.body.name });

    if (planExist) {
      throw new http422Error("Plan with that name already exits");
    }

    let planCreated = await plan.save();

    let user = (await User.findOne({ _id: req.params.id })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    user.plans.push(planCreated);

    await user.save();

    res.status(201).json({ plan: planCreated });
  } catch (error) {
    next(error);
  }
};

const updatePlan: RequestHandler<IParams, {}, IPlans> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let planUpdate = (await Plans.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })) as IPlans;

    let user = (await User.findOne({ _id: planUpdate.userId })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    let userPlans = user.plans.map((v) => {
      if (!!v._id && v._id.toString() === planUpdate._id.toString()) {
        return {
          ...planUpdate,
          plansId: planUpdate._id,
        };
      }
      return { ...v };
    });

    user.plans = userPlans;
    await user.save();

    res.status(201).json({ plan: planUpdate });
  } catch (error) {
    next(error);
  }
};

const deletePlane: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const deletedPlan = (await Plans.findByIdAndDelete({
      _id: req.params.id,
    })) as IPlans;

    let user = await User.findOne({ _id: deletedPlan.userId });

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    let userPlans = user.plans.filter(
      (v) => v._id && v._id.toString() != deletedPlan._id.toString()
    );

    user.plans = userPlans;
    user.save();

    res.status(204).send({ success: "ok" });
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

export const userController = {
  getUsers,
  getUserHealth,
  createUser,
  updateUser,
  updateUserCosts,
  deleteUser,
  createPlan,
  updatePlan,
  deletePlane,
  pokeUser,
};
