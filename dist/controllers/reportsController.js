"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = void 0;
const user_1 = __importDefault(require("../model/user"));
const getAllVerifyUsers = (req, res, next) => {
    user_1.default.find({ userVerified: true }).then((user) => {
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
exports.reportsController = {
    getAllVerifyUsers,
};
