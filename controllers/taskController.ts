import { INotificaion, ITask, ITaskPayload } from "../types/types";
import { NextFunction, Request, Response } from "express";

import Notification from "../model/notification";
import Task from "../model/task";
import { validationResult } from "express-validator";

const getTasks = (
  req: Request<{ id: string }, {}, ITaskPayload>,
  res: Response<{ error?: string; task?: any }>,
  next: NextFunction
) => {
  Task.find({ done: false })
    .then((tasks: ITask[]) => {
      let arr: any = tasks.filter(
        (task: ITask) =>
          task.mentorId == req.params.id || task.userId == req.params.id
      );
      if (arr.length == 0) {
        return res.status(200).json({ task: null });
      }
      console.log("Get Error:", arr);
      res.status(200).json({ task: arr });
    })
    .catch((err: any) => {
      console.log("Get task Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createTask = (
  req: Request<{}, {}, ITaskPayload>,
  res: Response<{ error?: string; task?: ITask }>,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  const task = new Task({
    toDo: req.body.toDo,
    done: false,
    userId: req.body.userId,
    mentorId: req.body.mentorId,
  });

  task
    .save()
    .then((task: any) => {
      console.log("Create task:", task);
      const notification = new Notification({
        isAchievement: false,
        isTask: true,
        isMentoring: false,
        isRead: false,
        userId: task.userId,
      });
      notification.save().then((notificaiton:INotificaion) => {
        console.log("Create Notification:", notificaiton);
        res.status(201).json({ task });
      })
    })
    .catch((err: any) => {
      console.log("Create task Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateTask = (
  req: Request<{ id: string }, {}, ITaskPayload>,
  res: Response<{ task: ITask }>,
  next: NextFunction
) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((task: any) => {
      console.log({ "task Updated": task });
      res.status(201).json({ task });
    })
    .catch((err: any) => {
      console.log("Update task Error:", err);
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
};
