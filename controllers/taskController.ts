import { IParams, ITask, ITaskPayload, ITaskUser, IUser } from "../types/types";

import Notification from "../model/notification";
import { RequestHandler } from "express";
import Task from "../model/task";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const io = require("../socket");

const getTasks: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let tasks = (await Task.find()) as ITask[];

    let arr = tasks.filter((task: ITask) => task.userId == req.params.id);

    if (arr.length == 0) {
      return res.status(200).json({ task: null });
    }

    res.status(200).json({ task: arr });
  } catch (error) {
    next(error);
  }
};

const getTasksByMentor: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let tasks = (await Task.find()) as ITask[];

    let arr = tasks.filter(
      (task: ITask) =>
        task.userId == req.params.userId && task.mentorId == req.params.mentorId
    );

    if (arr.length == 0) {
      return res.status(200).json({ task: null });
    }

    res.status(200).json({ task: arr });
  } catch (error) {
    next(error);
  }
};

const createTask: RequestHandler<{}, {}, ITaskPayload> = async (
  req,
  res,
  next
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

    let taskCreate = await task.save();

    let user = (await User.findOne({ _id: taskCreate.userId })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    user.tasks.push(taskCreate);

    await user.save();

    const notification = new Notification({
      isTask: true,
      isMentoring: false,
      isRead: false,
      userId: taskCreate.userId,
    });

    let notificaitonCreate = await notification.save();

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

    let tasks = await Task.find({ userId: user._id });

    res.status(201).json({ task: tasks });
  } catch (error) {
    next(error);
  }
};

const updateTask: RequestHandler<IParams, {}, ITaskPayload> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    let taskUpdate = (await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })) as ITask;

    let user = (await User.findOne({ _id: taskUpdate.userId })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    let userTasks = user.tasks.map((v) => {
      if (!!v._id && v._id.toString() === taskUpdate._id.toString()) {
        return {
          ...taskUpdate,
          taskId: taskUpdate._id,
        };
      }
      return { ...v };
    });

    user.tasks = userTasks;
    await user.save();

    res.status(201).json({ task: taskUpdate });
  } catch (err: any) {
    next(err);
  }
};

const deleteTask: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const deletedTask = (await Task.findByIdAndDelete({
      _id: req.params.id,
    })) as ITask;

    let user = await User.findOne({ _id: deletedTask.userId });

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    let userTasks = user.tasks.filter(
      (v) => v._id && v._id.toString() != deletedTask._id.toString()
    );

    user.tasks = userTasks;
    user.save();

    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const taskController = {
  createTask,
  updateTask,
  getTasks,
  getTasksByMentor,
  deleteTask,
};
