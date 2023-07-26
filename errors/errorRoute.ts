import { body, param } from "express-validator";

import { IUser } from "../types/types";
import Mentor from "../model/mentor";
import User from "../model/user";

//common errors
export const checkIdParams = () =>
  param("id").custom((value) => {
    if (value.length !== 24) {
      return Promise.reject("ID is not valid");
    } else {
      return Promise.resolve();
    }
  });

export const checkUserExist = () =>
  body("email").custom((value, { req }) => {
    if (!req.body.email) {
      return Promise.reject("Email is required");
    }
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject(
          "User with that email doesn't exist in our database. Share the app with him on a home screen"
        );
      } else {
        return Promise.resolve();
      }
    });
  });

export const checkAlreadyMentored = () =>
  body("user").custom((value) => {
    if (!value) {
      return Promise.reject("User doesn't exist.Please try again later.");
    }
    if (!value.email) {
      return Promise.reject("Email required.Please try again later.");
    }
    return Promise.resolve();
  });

export const checkMentoringYourSelf = () =>
  body("email").custom((value, { req }) => {
    if (!req.body.email) {
      return Promise.reject("User doesn't exist.Please try again later.");
    }
    if (req.body.user.email == value) {
      return Promise.reject("Can't mentor your self");
    }
    return Promise.resolve();
  });

// Tasks error handling
export const checkUserIDExist = () =>
  body("userId").custom((value) => {
    return User.findOne({ _id: value }).then((user) => {
      if (!user) {
        return Promise.reject("Create Task User ID doesn't exist");
      } else {
        return Promise.resolve();
      }
    });
  });

export const checkMentorIDExist = () =>
  body("mentorId").custom((value) => {
    return Mentor.findOne({ mentorId: value }).then((user) => {
      if (!user) {
        return Promise.reject("Create Task Mentor ID doesn't exist");
      } else {
        return Promise.resolve();
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
      } else {
        return Promise.resolve();
      }
    });
  });
