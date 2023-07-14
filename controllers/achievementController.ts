import { IAchievement, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";

import Achievement from "../model/achievement";
import User from "../model/user";
import { http500Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const createAchievement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const achievement = new Achievement({
    name: req.body.name,
    description: req.body.description,
    categorie: req.body.categorie,
    points: req.body.points,
    type: req.body.type,
  });
  try {
    let achievementSaved = await achievement.save();
    res.status(201).json({ achievement: achievementSaved });
  } catch (error) {
    next(error);
  }
};

const getAchievemnts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http500Error();
    }

    let achievements: IAchievement[] = await Achievement.find();

    let user = (await User.findOne({ _id: req.params.id })) as IUser;

    let newAch = achievements.map((achs: any) => {
      switch (true) {
        case user?.consumptionInfo.cigarettesAvoided >= achs.tag &&
          achs.categorie == "cigarettesAvoided":
          return { ...achs._doc, holding: true };
        case !!user?.smokingInfo &&
          user?.smokingInfo.noSmokingDays >= achs.tag &&
          achs.categorie == "noSmokingDays":
          return { ...achs._doc, holding: true };
        case !!user?.tasks &&
          user?.tasks.length >= achs.tag &&
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
        achievements: newAch.sort((a: any, b: any) => b.holding - a.holding),
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
