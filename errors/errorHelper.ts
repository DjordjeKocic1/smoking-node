import Mentor from "../model/mentor";
import Task from "../model/task";
import User from "../model/user";
import { body } from "express-validator";

export const checkUserExist = (msg: string) =>
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject(msg);
      }
    });
  });

export const checkAlreadyMentored = (msg: string) =>
  body("user").custom((value) => {
    return Mentor.findOne({mentoringUserId:value._id}).then((user) => {
      if (user) {
        return Promise.reject(msg);
      }
    });
  });

export const checkMentoringYourSelf = (msg: string) =>
  body("email").custom((value, { req }) => {
    if (req.body.user.email == value) {
      return Promise.reject(msg);
    } else {
      return Promise.resolve();
    }
  });

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
