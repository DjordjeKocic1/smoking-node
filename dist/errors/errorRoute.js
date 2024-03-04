"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = exports.checkModelID = exports.checkUserIdParamExist = exports.checkMentorIDParamExist = exports.checkMentorIDExist = exports.checkUserIDExist = exports.checkMentoringYourSelf = exports.validateRemoveAccountReq = exports.checkUserExist = void 0;
const express_validator_1 = require("express-validator");
const mentor_1 = __importDefault(require("../model/mentor"));
const sessions_1 = __importDefault(require("../model/sessions"));
const user_1 = __importDefault(require("../model/user"));
const checkUserExist = () => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (!req.body.email) {
        return Promise.reject("Email is required");
    }
    return user_1.default.findOne({ email: value }).then((user) => {
        if (!user) {
            return Promise.reject("User with that email doesn't exist in our database.");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkUserExist = checkUserExist;
const validateRemoveAccountReq = () => {
    return {
        checkUserIdAndEmail: (0, express_validator_1.body)("params").custom((value) => {
            return user_1.default.findOne({ email: value.email, _id: value.id }).then((user) => {
                if (!user) {
                    return Promise.reject("This is not your email.");
                }
                else {
                    return Promise.resolve();
                }
            });
        }),
        checkUserID: (0, express_validator_1.body)("params").custom((value) => {
            if (!value.id) {
                return Promise.reject("User ID from url is missing, please login again.");
            }
            if (value.id.length < 24) {
                return Promise.reject("User ID from url is missing or incorrect");
            }
            if (value.id === "") {
                return Promise.reject("User ID from url can't be empty");
            }
            return user_1.default.findOne({ _id: value.id }).then((user) => {
                if (!user) {
                    return Promise.reject("User with that ID doesn't exist in our database. Please check if you accidentally removed 'id' from url, if you did, please go back to login page and try again.");
                }
                else {
                    return Promise.resolve();
                }
            });
        }),
        checkUserEmail: (0, express_validator_1.body)("params").custom((value) => {
            return user_1.default.findOne({ email: value.email }).then((user) => {
                if (!user) {
                    return Promise.reject("User with that email doesn't exist in our database.");
                }
                else {
                    return Promise.resolve();
                }
            });
        }),
    };
};
exports.validateRemoveAccountReq = validateRemoveAccountReq;
const checkMentoringYourSelf = () => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (!req.body.email) {
        return Promise.reject("User doesn't exist.Please try again later.");
    }
    if (req.body.user.email == value) {
        return Promise.reject("Can't mentor your self");
    }
    return Promise.resolve();
});
exports.checkMentoringYourSelf = checkMentoringYourSelf;
// Tasks error handling
const checkUserIDExist = () => (0, express_validator_1.body)("userId").custom((value) => {
    return user_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("Create Task User ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkUserIDExist = checkUserIDExist;
const checkMentorIDExist = () => (0, express_validator_1.body)("mentorId").custom((value) => {
    return mentor_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("Create Task Mentor ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkMentorIDExist = checkMentorIDExist;
const checkMentorIDParamExist = () => (0, express_validator_1.param)("mentorId").custom((value) => {
    return mentor_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("Mentor ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkMentorIDParamExist = checkMentorIDParamExist;
const checkUserIdParamExist = () => (0, express_validator_1.param)("userId").custom((value) => {
    return user_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("User ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkUserIdParamExist = checkUserIdParamExist;
//Model ID error
const checkModelID = (Model) => (0, express_validator_1.param)("id").custom((value) => {
    return Model.findOne({ _id: value }).then((modalData) => {
        if (!modalData) {
            return Promise.reject(`${Model.modelName} doesn't exist, please try again, it could be something wrong with a server.`);
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkModelID = checkModelID;
const checkSession = () => {
    return {
        checkBodyEmail: (0, express_validator_1.body)("email").custom((value) => {
            return sessions_1.default.findOne({ email: value }).then((data) => {
                if (data) {
                    return Promise.reject("You already sent an request");
                }
                else {
                    return Promise.resolve();
                }
            });
        }),
        checkParamEmail: (0, express_validator_1.body)("params").custom((value) => {
            return sessions_1.default.findOne({ email: value.email }).then((user) => {
                if (user) {
                    return Promise.reject("You already sent an request");
                }
                else {
                    return Promise.resolve();
                }
            });
        }),
    };
};
exports.checkSession = checkSession;
