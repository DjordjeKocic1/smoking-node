import { INotificaion, IParams, IUser } from "../types/types";

import Notification from "../model/notification";
import { RequestHandler } from "express";
import User from "../model/user";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const getNotificationsByUserID: RequestHandler<IParams> = async (
  req,
  res,
  next
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

const createNotification: RequestHandler<{}, {}, INotificaion> = async (
  req,
  res,
  next
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

    let notificationCreate = await notification.save();

    res.status(201).json({ notification: notificationCreate });
  } catch (error) {
    next(error);
  }
};
const updateNotification: RequestHandler<IParams, {}, INotificaion> = async (
  req,
  res,
  next
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

const deleteNotification: RequestHandler<IParams> = async (req, res, next) => {
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
