import { body, param } from "express-validator";

import Mentor from "../model/mentor";
import User from "../model/user";

//common errors
export const checkIdParams = () =>
  param("id").custom((value) => {
    if (value.length !== 24) {
      return Promise.reject("Param Id is not valid");
    } else {
      return Promise.resolve();
    }
  }); 

export const checkUserExist = () =>
  body("email").custom((value, { req }) => {
    if (!req.body.email) {
      return Promise.reject("User doesn't exist.Please try again later.");
    }
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject("User with that email doesn't exist");
      }
    });
  });

export const checkAlreadyMentored = () =>
  body("user").custom((value) => {
    if (!value) {
      return Promise.reject("User doesn't exist.Please try again later.");
    }
    return Mentor.findOne({ mentoringUserId: value._id }).then((user) => {
      if (user) {
        return Promise.reject("Already sent a mentor request");
      }
    });
  });

export const checkMentoringYourSelf = () =>
  body("email").custom((value, { req }) => {
    if (!req.body.email) {
      return Promise.reject("User doesn't exist.Please try again later.");
    }
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

//Model ID error
export const checkModelID = (Model: any) =>
  param("id").custom((value) => {
    return Model.findOne({ _id: value }).then((modalData: any) => {
      if (!modalData) {
        return Promise.reject(
          `${Model.modelName} doesn't exist, please try again, it could be something wrong with a server.`
        );
      }
    });
  });
