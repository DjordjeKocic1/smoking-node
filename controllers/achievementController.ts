import { NextFunction, Request, Response } from "express";

import Achievement from "../model/achievement";
import { IAchievement } from "../types/types";

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
    res.status(200).json({ achievements });
  });
};

export const achievementController = {
  createAchievement,
  getAchievemnts,
};
