import { body, param } from "express-validator";

import Mentor from "../model/mentor";
import User from "../model/user";

export const checkUserExist = () =>
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject("User with that email doesn't exist");
      }
    });
  });

export const checkAlreadyMentored = () =>
  body("user").custom((value) => {
    return Mentor.findOne({ mentoringUserId: value._id }).then((user) => {
      if (user) {
        return Promise.reject("Already sent a mentor request");
      }
    });
  });

export const checkMentoringYourSelf = () =>
  body("email").custom((value, { req }) => {
    if (req.body.user.email == value) {
      return Promise.reject("Can't mentor your self");
    } else {
      return Promise.resolve();
    }
  });

// Tasks error handling
export const checkUserIDExist = () =>
  body("userId").custom((value) => {
    return User.findOne({ _id: value }).then((user) => {
      if (!user) {
        return Promise.reject("User of that ID doesnt exists");
      }
    });
  });

//id error

export const checkIDParam = (Model: any) =>
  param("id").custom((value) => {
    if (value.length != 24) {
      return Promise.reject(`ID [${value}] length is not 24 chars`);
    }
    return Model.findOne({ _id: value }).then((modalData: any) => {
      if (!modalData) {
        return Promise.reject(
          `${Model.modelName} ID [${value}] doesn't exist, please try again later, it could be something wrong with a server. Thank you for your patient`
        );
      }
    });
  });