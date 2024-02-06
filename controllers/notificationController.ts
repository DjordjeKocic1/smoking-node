import {
  INotificaion,
  IParams,
  IQueryParams,
  IUser,
} from "../types/types";

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
      userId: req.params.id,
    });

    res.status(201).json({ notification: notifications });
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

    let notificationCreated = await notification.save();

    res.status(201).json({ notification: notificationCreated });
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

    const { isTask, isMentoring } = req.body;

    let notificationUpdate = await Notification.find({
      userId: req.params.userId,
    });

    for (const not of notificationUpdate) {
      if (not.isTask && isTask) {
        not.isRead = isTask;
      } else if (not.isMentoring && isMentoring) {
        not.isRead = isMentoring;
      } else {
        not.isRead = false;
      }
      await not.save();
    }

    res.status(201).json({ notification: notificationUpdate });
  } catch (error) {
    next(error);
  }
};

const deleteNotification: RequestHandler<
  IParams,
  {},
  {},
  IQueryParams
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let isTask = req.query.isTask == "true";
    let isMentoring = req.query.isMentoring == "true";

    await Notification.deleteMany({
      userId: req.params.userId,
      isTask,
      isMentoring,
    });

    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteAllNotification: RequestHandler<IParams> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    await Notification.deleteMany({ userId: req.params.id });

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
  deleteAllNotification,
};
