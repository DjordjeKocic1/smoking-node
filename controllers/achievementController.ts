import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import Achievement from "../model/achievement";
import { IAchievement } from "../types/types";
import User from "../model/user";
import { validationResult } from "express-validator";

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http422Error(errors.array()[0].msg);
  }
  Achievement.find()
    .then((achievements) => {
      User.findOne({ _id: req.params.id })
        .then((user: any) => {
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
            let achievementHold = newAch.filter((v) => {
              if (v.holding) {
                return v;
              }
            });
            user.achievements = achievementHold;
            user.save();

            res
              .status(200)
              .json({
                achievements: achievementHold.sort(
                  (a, b) => b.holding - a.holding
                ),
              });
          }
        })
        .catch(() => {
          next(new http500Error());
        });
    })
    .catch(() => {
      next(new http500Error());
    });
};
export const achievementController = {
  createAchievement,
  getAchievemnts,
};
