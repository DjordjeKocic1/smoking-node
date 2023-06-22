import { INotificaion, ITask, ITaskPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { validationResult } from "express-validator";

const getTasks = (
  req: Request<{ id: string }>,
  res: Response<{ success?: string; error?: string; task?: any }>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new http422Error(errors.array()[0].msg);
  }
  Task.find()
    .then((tasks: ITask[]) => {
      let arr: any = tasks.filter(
        (task: ITask) => task.userId == req.params.id
      );
      if (arr.length == 0) {
        return res.status(200).json({ success: "ok", task: [] });
      }
      res.status(200).json({ task: arr });
    })
    .catch(() => {
      next(new http500Error());
    });
};

const createTask = (
  req: Request<{}, {}, ITaskPayload>,
  res: Response<{ success?: string; error?: string; task?: ITask }>,
  next: NextFunction
) => {
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

  task
    .save()
    .then((task: any) => {
      const notification = new Notification({
        isTask: true,
        isMentoring: false,
        isRead: false,
        userId: task.userId,
      });
      notification.save().then((notificaiton: INotificaion) => {
        User.findOne({ _id: notificaiton.userId }).then((user: any) => {
          if (!user.notificationToken) {
            return res.status(201).json({ success: "ok", task });
          }
          expoNotification
            .sendPushNotification({
              to: user.notificationToken,
              title: "Task",
              body: "You have a new task 📝",
            })
            .then(() => {
              res.status(201).json({ success: "ok", task });
            })
            .catch(() => {
              next(new http500Error());
            });
        });
      });
    })
    .catch(() => {
      next(new http500Error());
    });
};

const updateTask = (
  req: Request<{ id: string }, {}, ITaskPayload>,
  res: Response<{ success?: string; error?: string; task?: ITask }>,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((task: any) => {
      if (req.body.status == "done") {
        User.findOne({ _id: task.userId }).then((user: any) => {
          user.tasks.push({ taskId: task._id, name: task.toDo });
          user.save();
        });
      }
      console.log({ "task Updated": task });
      res.status(201).json({ success: "ok", task });
    })
    .catch((err: any) => {
      console.log("Update task Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteTask = (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  Task.deleteOne({ _id: req.params.id })
    .then((task: any) => {
      console.log({ "task delete": task });
      res.status(204).json({ success: "ok" });
    })
    .catch((err: any) => {
      console.log("delete task Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const taskController = {
  createTask,
  updateTask,
  getTasks,
  deleteTask,
};
