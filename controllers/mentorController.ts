import { IMentor, IMentorPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

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
    throw new http422Error(errors.array()[0].msg);
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
                notification.save().then(() => {
                  res.status(201).json({ mentor });
                });
              })
              .catch(() => {
                next(new http500Error());
              });
          })
          .catch(() => {
            next(new http500Error());
          });
      });
    })
    .catch(() => {
      next(new http500Error());
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
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      });
    })
    .catch((err: any) => {
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
      return mentor;
    })
    .then((mentor) => {
      return Task.deleteMany({ mentorId: mentor.mentorId });
    })
    .then((result) => {
      res.status(200).json({ success: "ok" });
    })
    .catch((err: any) => {
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
