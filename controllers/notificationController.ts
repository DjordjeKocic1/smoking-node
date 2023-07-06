import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import { INotificaion } from "../types/types";
import Notification from "../model/notification";
import User from "../model/user";
import { validationResult } from "express-validator";

const getNotificationsByUserID = (
  req: Request<{ id: string }, {}, INotificaion>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http422Error(errors.array()[0].msg);
  }
  Notification.find({ isRead: false })
    .then((notifications: INotificaion[]) => {
      let nots = notifications.filter(
        (notification: INotificaion) => notification.userId == req.params.id
      );
      res.status(201).json({ notification: nots });
    })
    .catch((err) => {
      next(err);
    });
};

const createNotification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new http500Error("User doesn't exist");
      }
      const notification = new Notification({
        isMentoring: req.body.isMentoring,
        isTask: req.body.isTask,
        isRead: false,
        userId: user?._id,
      });
      notification
        .save()
        .then((notification: INotificaion) => {
          res.status(201).json({ notification });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
const updateNotification = (
  req: Request<{ id: string }, {}, INotificaion>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http422Error(errors.array()[0].msg);
  }
  Notification.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((notification) => {
      res.status(201).json({ notification });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteNotification = (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http422Error(errors.array()[0].msg);
  }
  Notification.findOneAndDelete({ _id: req.params.id })
    .then((notification: any) => {
      res.status(204);
    })
    .catch((err) => {
      next(err);
    });
};
export const notificationController = {
  createNotification,
  updateNotification,
  getNotificationsByUserID,
  deleteNotification,
};
