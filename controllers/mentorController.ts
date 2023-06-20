import { IMentor, IMentorPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { validationResult } from "express-validator";

const getMentor = (
  req: Request<{ id: string }>,
  res: Response<{ error?: string; mentor?: any }>,
  next: NextFunction
) => {
  Mentor.find()
    .then((mentors: IMentor[]) => {
      let arr: any = mentors.filter(
        (mentor: IMentor) =>
          mentor.mentoringUser[0]._id == req.params.id ||
          mentor.mentorId == req.params.id
      );
      if (arr.length == 0) {
        return res.status(200).json({ mentor: null });
      }
      User.findOne({ email: arr[0].mentoringUser[0].email }).then((user) => {
        let mentorTrans = arr.map((mentor: IMentor[]) => {
          return {
            ...mentor,
            mentoringUser: user,
          };
        });

        res.status(200).json({
          mentor: {
            ...mentorTrans[0]._doc,
            mentoringUser: [mentorTrans[0].mentoringUser],
          },
        });
      });
    })
    .catch((err: any) => {
      console.log("Find Mentor Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createMentor = (
  req: Request<{}, {}, IMentorPayload>,
  res: Response<{ error?: string; mentor?: IMentor }>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err: any = new Error(errors.array()[0].msg)
    err.statusCode = 422;
    throw err; //thorw error will go to next error handling
  }

  User.findOne({ email: req.body.user.email })
    .then((user: any) => {
      User.findOne({ email: req.body.email }).then((userMentor: any) => {
        const mentor = new Mentor({
          name: req.body.name.trim(),
          email: req.body.email,
          accepted: false,
          mentorId: userMentor?._id,
          mentoringUserId: user?._id,
          mentoringUser: user,
        });
        mentor
          .save()
          .then((mentor: IMentor) => {
            if (!userMentor.notificationToken) {
              return res.status(201).json({ mentor });
            }
            expoNotification
              .sendPushNotification({
                to: userMentor.notificationToken,
                title: "Mentor",
                body: "New mentor request 🔧",
              })
              .then(() => {
                const notification = new Notification({
                  isTask: false,
                  isMentoring: true,
                  isRead: false,
                  userId: mentor.mentorId,
                });
                notification.save().then((not) => {
                  console.log("Create Notification:", not);
                  console.log("Created Mentor:", mentor);
                  res.status(201).json({ mentor });
                });
              })
              .catch((err) => {
                console.log("Expo Notification Token:", err);
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          })
          .catch((err: any) => {
            console.log("Create Mentor Error:", err);
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      });
    })
    .catch((err: any) => {
      console.log("User Mentor Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateMentor = (
  req: Request<{ id: string }, {}, IMentorPayload>,
  res: Response<{ mentor: IMentor }>,
  next: NextFunction
) => {
  Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((mentor: any) => {
      User.findOne({ _id: mentor.mentoringUserId }).then((user) => {
        if (!user?.notificationToken) {
          return res.status(201).json({ mentor });
        }
        expoNotification
          .sendPushNotification({
            to: user.notificationToken,
            title: "Mentor",
            body: `Mentor (${mentor.email}) accepted your request ✅`,
          })
          .then(() => {
            res.status(201).json({ mentor });
          })
          .catch((err) => {
            console.log("Expo Notification Token:", err);
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      });
    })
    .catch((err: any) => {
      console.log("Update Mentor Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteMentor = (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  Mentor.findOneAndDelete({ _id: req.params.id })
    .then((mentor: any) => {
      console.log({ "mentor deleted": mentor });
      return mentor;
    })
    .then((mentor) => {
      return Task.deleteMany({ mentorId: mentor.mentorId });
    })
    .then((result) => {
      console.log({ "task deleted": result });
      res.status(200).json({ success: "ok" });
    })
    .catch((err: any) => {
      console.log("delete mentor Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const mentorController = {
  createMentor,
  updateMentor,
  getMentor,
  deleteMentor,
};
