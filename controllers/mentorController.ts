import { IMentor, IMentorPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
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
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  User.findOne({ email: req.body.user.email })
    .then((user: any) => {
      User.findOne({ email: req.body.email }).then((userMentor: any) => {
        const mentor = new Mentor({
          name: req.body.name.trim(),
          email: req.body.email,
          accepted: false,
          mentorId: userMentor?._id,
          mentoringUser: user,
        });
        mentor
          .save()
          .then((mentor: IMentor) => {
            console.log("Create Mentor:", mentor);
            const notification = new Notification({
              isAchievement: false,
              isTask: false,
              isMentoring: true,
              isRead: false,
              userId: mentor.mentorId,
            });
            notification.save().then((not) => {
              console.log("Create Notification:", not);
              res.status(201).json({ mentor });
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
      console.log("Create Mentor Error:", err);
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
      console.log({ "Mentor Updated": mentor });
      res.status(201).json({ mentor });
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
      Task.deleteMany({ mentorId: mentor.mentorId }).then(() => {
        console.log("Tasks Deleted");
        res.status(201).json({ success: "ok" });
      });
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
