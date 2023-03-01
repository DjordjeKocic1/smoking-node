import { IUser } from "../types/types";
import Mentor from "../model/mentor";
import Task from "../model/task";
import User from "../model/user";
import { body } from "express-validator";

export const checkExistMentoring = (msg: string) =>
  body("email").custom((value) => {
    return Mentor.findOne({ email: value }).then((mentor) => {
      if (mentor) {
        return Promise.reject(`${msg} - ${mentor.mentoringUser[0].email}`);
      }
    });
  });
// end

// Tasks error handling
export const checkUserIDExist = (msg: string) =>
  body("userId").custom((value) => {
    return User.findOne({ _id: value }).then((user) => {
      if (!user) {
        return Promise.reject(msg);
      }
    });
  });
export const checkMentoringUserIDExist = (msg: string) =>
  body("userId").custom((value) => {
    return Task.findOne({ userId: value }).then((task) => {
      Mentor.findOne({ _id: task?.mentorId }).then((mentor) => {
        if (!mentor) {
          return Promise.reject(msg);
        }
      });
    });
  });

// end
