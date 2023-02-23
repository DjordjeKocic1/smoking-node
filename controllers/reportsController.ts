import { NextFunction, Request, Response } from "express";

import Categorie from "../model/categories";
import { IUser } from "../types/types";
import User from "../model/user";

const getAllVerifyUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({ userVerified: true }).then((user: IUser[]) => {
    res.status(200).json({ verifyUsers: user });
  });
};

// const getAllUsersByCategorie = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let categorieName = req.params.name;
//   Categorie.find({ name: categorieName }).then((categories: any[]) => {
//     User.find({ userVerified: true }).then((users: IUser[]) => {
//       let usersWithCategorieName = users.filter((user:IUser) => user.categories.)
//     });
//   });
// };

export const reportsController = {
  getAllVerifyUsers,
};
