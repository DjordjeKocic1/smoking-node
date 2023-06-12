import { NextFunction, Request, Response } from "express";

import Achievement from "../model/achievement";
import { IAchievement } from "../types/types";
import User from "../model/user";

const createAchievement = (req: Request, res: Response) => {
  const achievement = new Achievement({
    name: req.body.name,
    description: req.body.description,
    categorie: req.body.categorie,
    points: req.body.points,
    type: req.body.type,
  });
  achievement
    .save()
    .then((achievement: IAchievement) => res.status(201).json({ achievement }))
    .catch((error) => {
      res.status(502).json({ error });
    });
};

const getAchievemnts = (req: Request, res: Response, next: NextFunction) => {
  Achievement.find().then((achievements) => {
    User.findOne({ _id: req.params.userId }).then((user) => {
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
      res
        .status(200)
        .json({ achievements: newAch.sort((a, b) => b.holding - a.holding) });
    });
  });
};
export const achievementController = {
  createAchievement,
  getAchievemnts,
};
