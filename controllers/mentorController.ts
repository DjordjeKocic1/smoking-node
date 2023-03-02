import { IMentor, IMentorPayload, IUser } from "../types/types";
import { NextFunction, Request, Response } from "express";

import Mentor from "../model/mentor";
import User from "../model/user";
import { validationResult } from "express-validator";

const createMentor = (
  req: Request<{}, {}, IMentorPayload>,
  res: Response<{ error?: string; mentor?: IMentor }>,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  User.findOne({ email: req.body.user.email }).then((user: any) => {
    if (!user) {
      return res.status(422).json({ error: "user doesnt exist" });
    }
    const mentor = new Mentor({
      name: req.body.name,
      email: req.body.email,
      accepted: req.body.user,
      mentoringUser: user,
    });

    mentor
      .save()
      .then((mentor: IMentor) => {
        console.log("Create Mentor:", mentor);
        res.status(201).json({ mentor });
      })
      .catch((err: any) => {
        console.log("Create Mentor Error:", err);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

const updateMentor = (
  req: Request<{ id: string }, {}, IMentorPayload>,
  res: Response<{ mentor: IMentor }>,
  next: NextFunction
) => {
  Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((mentor: any) => {
      console.log({ "Mentor Updated": mentor });
      res.status(201).json({ mentor });
    })
    .catch((err: any) => {
      console.log("Update Mentor Error:", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const mentorController = {
  createMentor,
  updateMentor,
};
