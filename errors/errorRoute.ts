import { body, param } from "express-validator";

import Mentor from "../model/mentor";
import User from "../model/user";

export const checkUser = () => {
  return {
    checkUserEmail: body("email").custom((value, { req }) => {
      if (!req.body.email) {
        return Promise.reject("Email is required");
      }
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject(
            "User with that email doesn't exist in our database."
          );
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkUserIDExist: body("userId").custom((value) => {
      return User.findOne({ _id: value }).then((user) => {
        if (!user) {
          return Promise.reject("Create Task User ID doesn't exist");
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkUserParamIDExist: param("userId").custom((value) => {
      return User.findOne({ _id: value }).then((user) => {
        if (!user) {
          return Promise.reject("User ID doesn't exist");
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkUserRegistratedPassword: body().custom((value) => {
      if (!value.password) {
        return Promise.reject("Password is required");
      }
      if (value.password !== value.repassword) {
        return Promise.reject("Passwords do not match");
      }
      return Promise.resolve();
    }),
    checkUserAdmin: body("email").custom((value) => {
      return User.findOne({ email: value, roles: "admin" }).then((user) => {
        if (!user) {
          return Promise.reject("You are not authorized to access this page");
        } else {
          return Promise.resolve();
        }
      });
    }),
  };
};

export const validateRemoveAccountReq = () => {
  return {
    checkUserIdAndEmail: body("params").custom((value) => {
      return User.findOne({ email: value.email, _id: value.id }).then(
        (user) => {
          if (!user) {
            return Promise.reject("This is not your email.");
          } else {
            return Promise.resolve();
          }
        }
      );
    }),
    checkUserID: body("params").custom((value) => {
      if (!value.id) {
        return Promise.reject(
          "Params from url is missing, please login again."
        );
      }
      if (value.id.length < 24) {
        return Promise.reject("Params from url is missing or incorrect");
      }
      if (value.id === "") {
        return Promise.reject("Params from url can't be empty");
      }
      return User.findOne({ _id: value.id }).then((user) => {
        if (!user) {
          return Promise.reject(
            "User doesn't exist in our database. Please check if you accidentally removed params from url, if you did, please go back to login page and try again."
          );
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkUserEmail: body("params").custom((value) => {
      return User.findOne({ email: value.email }).then((user) => {
        if (!user) {
          return Promise.reject(
            "User with that email doesn't exist in our database."
          );
        } else {
          return Promise.resolve();
        }
      });
    }),
  };
};

export const checkMentor = () => {
  return {
    checkMentorIDExist: body("mentorId").custom((value) => {
      return Mentor.findOne({ _id: value }).then((user) => {
        if (!user) {
          return Promise.reject("Create Task Mentor ID doesn't exist");
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkMentorIDParamExist: param("mentorId").custom((value) => {
      return Mentor.findOne({ _id: value }).then((user) => {
        if (!user) {
          return Promise.reject("Mentor ID doesn't exist");
        } else {
          return Promise.resolve();
        }
      });
    }),
    checkMentoringYourSelf: body("email").custom((value, { req }) => {
      if (!req.body.email) {
        return Promise.reject("User doesn't exist.Please try again later.");
      }
      if (req.body.user.email == value) {
        return Promise.reject("Can't mentor your self");
      }
      return Promise.resolve();
    }),
  };
};

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
