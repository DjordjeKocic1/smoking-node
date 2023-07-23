import { IMentor, IMentorPayload, IParams, IUser } from "../types/types";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { http422Error, http500Error } from "../errors/errorHandler";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import Task from "../model/task";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { validationResult } from "express-validator";

const getMentor: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentors = (await Mentor.find()) as IMentor[];

    let arr = mentors.filter(
      (mentor: IMentor) =>
        mentor.mentoringUser[0]._id == req.params.id ||
        mentor.mentorId == req.params.id
    );

    if (arr.length == 0) {
      return res.status(200).json({ mentor: null });
    }

    let user = (await User.findOne({
      email: arr[0].mentoringUser[0].email,
    })) as IUser;

    if (!user) {
      throw new http422Error("User doesn't exist");
    }

    let mentorTrans = arr.map((mentor) => {
      return {
        ...mentor,
        mentoringUser: user,
      };
    });

    res.status(200).json({
      mentor: {
        ...mentorTrans[0]._doc,
        mentoringUser: [mentorTrans[0].mentoringUser],
      },
    });
  } catch (error) {
    next(error);
  }
};

const createMentor: RequestHandler<{}, {}, IMentorPayload> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let user = (await User.findOne({ _id: req.body.user._id })) as IUser;

    let userMentor = (await User.findOne({ email: req.body.email })) as IUser;

    const mentor = new Mentor({
      name: req.body.name,
      email: req.body.email,
      accepted: false,
      mentorId: userMentor?._id,
      mentoringUserId: user?._id,
      mentoringUser: user,
    });

    let mentorCreate = await mentor.save();

    if (!userMentor.notificationToken) {
      return res.status(201).json({ mentor: mentorCreate });
    }

    await expoNotification.sendPushNotification({
      to: userMentor.notificationToken,
      title: "Mentor",
      body: "New mentor request 🔧",
    });

    const notification = new Notification({
      isTask: false,
      isMentoring: true,
      isRead: false,
      userId: mentor.mentorId,
    });

    await notification.save();

    res.status(201).json({ mentor: mentorCreate });
  } catch (error) {
    next(error);
  }
};

const updateMentor = async (
  req: Request<IParams, {}, IMentorPayload>,
  res: Response<{ mentor: IMentor }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentorUpdate = (await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    )) as IMentor;

    let user = (await User.findOne({
      _id: mentorUpdate.mentoringUserId,
    })) as IUser;

    if (!user?.notificationToken || !req.body.accepted) {
      return res.status(201).json({ mentor: mentorUpdate });
    }

    await expoNotification.sendPushNotification({
      to: user.notificationToken,
      title: "Mentor",
      body: `Mentor (${mentorUpdate.email}) accepted your request ✅`,
    });
    res.status(201).json({ mentor: mentorUpdate });
  } catch (error) {
    next(error);
  }
};

const deleteMentor = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: any }>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentorDelete = (await Mentor.findOneAndDelete({
      _id: req.params.id,
    })) as IMentor;

    await Task.deleteMany({ mentorId: mentorDelete.mentorId });

    res.status(204).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const mentorController = {
  createMentor,
  updateMentor,
  getMentor,
  deleteMentor,
};
