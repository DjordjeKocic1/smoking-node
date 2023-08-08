import { IAchievement, IParams, ITask, IUser } from "../types/types";
import { NextFunction, Request, RequestHandler, Response } from "express";

import Achievement from "../model/achievement";
import User from "../model/user";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const createAchievement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const achievement = new Achievement({
      name: req.body.name,
      description: req.body.description,
      categorie: req.body.categorie,
      points: req.body.points,
      type: req.body.type,
      tag: req.body.tag,
    });
    let achievementSaved = await achievement.save();
    res.status(201).json({ achievement: achievementSaved });
  } catch (error) {
    next(error);
  }
};

const getAchievemnts: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let achievements = (await Achievement.find()) as IAchievement[];

    let user = (await User.findOne({ _id: req.params.id })) as IUser;

    let userCompletedTasks = user.tasks.filter(
      (v) => v.status == "done"
    ) as ITask[];

    let newAch = achievements.map((achs) => {
      switch (true) {
        case user?.consumptionInfo.cigarettesAvoided >= achs.tag &&
          achs.categorie == "cigarettesAvoided":
          return { ...achs._doc, holding: true };
        case !!user?.smokingInfo &&
          user?.smokingInfo.noSmokingDays >= achs.tag &&
          achs.categorie == "noSmokingDays":
          return { ...achs._doc, holding: true };
        case !!user?.tasks &&
          !!userCompletedTasks.length &&
          userCompletedTasks.length >= achs.tag &&
          achs.categorie == "tasks":
          return { ...achs._doc, holding: true };
        case !!user?.healthInfo &&
          user?.healthInfo.avgHealth >= achs.tag &&
          achs.categorie == "avgHealth":
          return { ...achs._doc, holding: true };
        default:
          return { ...achs._doc, holding: false };
      }
    });

    if (newAch.length != 0) {
      user.achievements = newAch;
      await user.save();
      res.status(200).json({
        achievements: newAch.sort((a, b) => b.holding - a.holding),
      });
    }
  } catch (error) {
    next(error);
  }
};
export const achievementController = {
  createAchievement,
  getAchievemnts,
};
