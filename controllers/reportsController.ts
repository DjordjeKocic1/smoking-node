import { NextFunction, Request, Response } from "express";

import { IUser } from "../types/types";
import User from "../model/user";

const getAllVerifyUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({ userVerified: true }).then((user: IUser[]) => {
    res.status(200).json({ verifyUsers: user });
  });
};

const getAllUsersByCategorie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let categorieName = req.params.name;
  let arr: any = [];
  User.find({ userVerified: true })
    .then((user: IUser[]) => {
      user.forEach((u: IUser) => {
        u.categories?.map((cat: any) => {
          if (cat.name == categorieName) {
            arr.push({
              email: u.email,
              name: u.name,
              verified: u.userVerified,
              categorie: categorieName,
            });
          }
        });
      });

      if (arr?.length == 0) {
        return res.status(200).json({
          users: "User with that categorie name is not in database",
        });
      }
      res.status(200).json({ users: arr });
    })
    .catch((err: any) => console.log(err));
};

export const reportsController = {
  getAllVerifyUsers,
  getAllUsersByCategorie,
};
