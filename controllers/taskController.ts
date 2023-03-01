import { NextFunction, Request, Response } from "express";

import Task from "../model/task";
import { validationResult } from "express-validator";

const createTask = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  const task = new Task({
    toDo: req.body.toDo,
    done: req.body.done,
    userId: req.body.userId,
    mentorId: req.body.mentorId,
  });

  task
    .save()
    .then((task: any) => {
      console.log("Create task:", task);
      res.status(201).json({ task });
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
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((task) => {
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
};
