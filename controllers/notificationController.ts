import { INotificaion, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import Notification from "../model/notification";
import User from "../model/user";
import { validationResult } from "express-validator";

const getNotificationsByUserID = async (
  req: Request<{ id: string }, {}, INotificaion>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let notifications: INotificaion[] = await Notification.find({
      isRead: false,
    });

    let nots = notifications.filter(
      (notification: INotificaion) => notification.userId == req.params.id
    );

    res.status(201).json({ notification: nots });
  } catch (error) {
    next(error);
  }
};

const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let user = (await User.findOne({ email: req.body.email })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    const notification = new Notification({
      isMentoring: req.body.isMentoring,
      isTask: req.body.isTask,
      isRead: false,
      userId: user?._id,
    });

    let notificationCreate: INotificaion = await notification.save();

    res.status(201).json({ notification: notificationCreate });
  } catch (error) {
    next(error);
  }
};
const updateNotification = async (
  req: Request<{ id: string }, {}, INotificaion>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let notificationUpdate = (await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )) as INotificaion;

    res.status(201).json({ notification: notificationUpdate });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    await Notification.findOneAndDelete({ _id: req.params.id });

    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};
export const notificationController = {
  createNotification,
  updateNotification,
  getNotificationsByUserID,
  deleteNotification,
};
