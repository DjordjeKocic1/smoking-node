import { INotificaion, ITask, ITaskPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { validationResult } from "express-validator";

const getTasks = async (
  req: Request<{ id: string }>,
  res: Response<{ success?: string; error?: string; task?: any }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let tasks: ITask[] = await Task.find();

    let arr = tasks.filter((task: ITask) => task.userId == req.params.id);

    if (arr.length == 0) {
      return res.status(200).json({ task: null });
    }

    res.status(200).json({ task: arr });
  } catch (error) {
    next(error);
  }
};

const createTask = async (
  req: Request<{}, {}, ITaskPayload>,
  res: Response<{ success?: string; error?: string; task?: ITask }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const task = new Task({
      toDo: req.body.toDo,
      status: "",
      comment: req.body.comment,
      userId: req.body.userId,
      mentorId: req.body.mentorId,
    });

    let taskCreate: ITask = await task.save();

    const notification = new Notification({
      isTask: true,
      isMentoring: false,
      isRead: false,
      userId: taskCreate.userId,
    });

    let notificaitonCreate: INotificaion = await notification.save();

    let userFind = (await User.findOne({
      _id: notificaitonCreate.userId,
    })) as IUser;

    if (!userFind.notificationToken) {
      return res.status(201).json({ task: taskCreate });
    }

    await expoNotification.sendPushNotification({
      to: userFind.notificationToken,
      title: "Task",
      body: "You have a new task 📝",
    });

    res.status(201).json({ task: taskCreate });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (
  req: Request<{ id: string }, {}, ITaskPayload>,
  res: Response<{ success?: string; error?: string; task?: ITask }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let taskUpdate = (await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })) as ITask;

    if (req.body.status == "done") {
      let user = (await User.findOne({ _id: taskUpdate.userId })) as IUser;
      user.tasks.push({ taskId: taskUpdate._id, name: taskUpdate.toDo });
      await user.save();
    }

    res.status(201).json({ task: taskUpdate });
  } catch (err: any) {
    next(err);
  }
};

const deleteTask = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    await Task.deleteOne({ _id: req.params.id });
    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const taskController = {
  createTask,
  updateTask,
  getTasks,
  deleteTask,
};
