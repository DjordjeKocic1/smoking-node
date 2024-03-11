import { IParams, IPlans, IUser } from "../types/types";

import Plans from "../model/plans";
import { RequestHandler } from "express";
import User from "../model/user";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

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
      userType: req.body.userType,
      userId: req.params.id,
    });

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

const deletePlan: RequestHandler<IParams> = async (req, res, next) => {
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

export const planController = {
  createPlan,
  deletePlan,
};
