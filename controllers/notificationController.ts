import { NextFunction, Request, Response } from "express";

import { INotificaion } from "../types/types";
import Notification from "../model/notification";
import { validationResult } from "express-validator";

const getNotificationsByUserID = (
  req: Request<{ id: string }, {}, INotificaion>,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.id) {
    return res.status(422).json({ error: "user id doesnt exist" });
  }
  Notification.find()
    .then((notifications: INotificaion[]) => {
      let nots = notifications.filter(
        (notification: INotificaion) => notification.userId == req.params.id
      );
      res.status(201).json({ notification: nots });
    })
    .catch((err: any) => {
      console.log("Create Notificaiton Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
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

  const notification = new Notification({
    isMentoring: req.body.isMentoring,
    isAchievement: req.body.isAchievement,
    isRead: false,
    userId: req.body.userId,
  });

  notification
    .save()
    .then((notification: INotificaion) => {
      console.log("Create Notification:", notification);
      res.status(201).json({ notification });
    })
    .catch((err: any) => {
      console.log("Create Notificaiton Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
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
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  Notification.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((notification) => {
      console.log({ "Notification Updated": notification });
      res.status(201).json({ notification });
    })
    .catch((err: any) => {
      console.log("Update Notification Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
export const notificationController = {
  createNotification,
  updateNotification,
  getNotificationsByUserID,
};
