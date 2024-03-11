import {
  IMentor,
  IMentorPayload,
  IMentorUpdatePayload,
  IMentoringUser,
  INotificaion,
  IParams,
  IUser,
} from "../types/types";
import { NextFunction, Request, RequestHandler, Response } from "express";

import Mentor from "../model/mentor";
import Notification from "../model/notification";
import User from "../model/user";
import { expoNotification } from "../helpers/notifications/notifications";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const io = require("../socket");

const getMentor: RequestHandler<IParams> = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentors = (await Mentor.find()) as IMentor[];

    let arr = mentors.filter(
      (mentor: IMentor) => mentor.userId == req.params.id
    ) as any[];

    if (arr.length == 0) {
      return res.status(200).json({ mentor: null });
    }
    let ids = arr[0].mentoringUser.map((v: any) => v._id?.toString());

    let usersMentoring = await User.find().where("_id").in(ids).exec();

    if (usersMentoring) {
      let userMapping = usersMentoring.map((userMentor: any) => {
        let findUser = arr[0].mentoringUser.find(
          (v: any) => v._id.toString() === userMentor._id.toString()
        );
        return {
          ...userMentor._doc,
          accepted: findUser.accepted,
        };
      });
      arr[0].mentoringUser = userMapping;
    }

    res.status(200).json({
      mentor: arr[0],
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

    if (!user.subscription.subscriber) {
      throw new http422Error(`User is not subscriber`);
    }

    let userMentor = (await User.findOne({ email: req.body.email })) as IUser;

    if (!userMentor) {
      return res.status(201).send("EXISTSFALSE");
    }

    let mentorExist = (await Mentor.findOne({
      email: req.body.email,
    })) as IMentor;

    const mentor = new Mentor({
      name: req.body.name,
      email: req.body.email,
      userId: userMentor?._id,
      mentoringUser: {
        name: user.name,
        email: user.email,
        accepted: false,
        _id: user._id,
      },
    });

    let userExistWithinMentor =
      mentorExist &&
      mentorExist.mentoringUser.find((value) => value.email == user.email);

    if (userExistWithinMentor) {
      throw new http422Error(`You are already mentored by that user`);
    }

    let mentorCreate: IMentor;

    if (mentorExist) {
      mentorExist.mentoringUser.push({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
      mentorCreate = await mentorExist.save();
    } else {
      mentorCreate = await mentor.save();
    }

    user.mentors.push(mentorCreate);
    await user.save();

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
      userId: mentor.userId,
    });

    await notification.save();

    let notifications: INotificaion[] = await Notification.find({
      userId: mentorCreate.userId,
    });

    io.getIO().emit("live", {
      action: "create",
      notification: notifications,
      mentors: mentorCreate,
      ID: mentorCreate.userId,
    });

    res.status(201).json({ mentor: mentorCreate });
  } catch (error) {
    next(error);
  }
};

const updateMentor = async (
  req: Request<IParams, {}, IMentorUpdatePayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentorUpdate = (await Mentor.findOne({
      _id: req.params.id,
    })) as IMentor;

    let arr = mentorUpdate.mentoringUser.map((v) => {
      if (v._id?.toString() == req.body.user.userId.toString()) {
        return {
          ...v,
          accepted: req.body.user.accepted,
          name: req.body.name,
        };
      }
      return {
        ...v,
      };
    }) as IMentoringUser[];

    mentorUpdate.mentoringUser = arr;

    await mentorUpdate.save();

    let user = await User.findOne({
      _id: req.body.user.userId,
    });

    if (!!user) {
      let userArr = user.mentors.map((v) => {
        if (v._id?.toString() == mentorUpdate._id.toString()) {
          return {
            ...v,
            accepted: req.body.user.accepted,
            name: req.body.name,
          };
        }
        return {
          ...v,
        };
      });

      user.mentors = userArr;
      await user.save();
    }

    if (!user?.notificationToken || !req.body.user.accepted) {
      return res.status(201).json({ mentor: mentorUpdate });
    }

    await expoNotification.sendPushNotification({
      to: user.notificationToken,
      title: "Mentor",
      body: `Mentor (${mentorUpdate.email}) accepted your request ✅`,
    });

    io.getIO().emit("live", {
      action: "update",
      userM: user,
      ID: user._id,
    });

    res.status(201).json({ mentor: mentorUpdate });
  } catch (error) {
    next(error);
  }
};

const deleteMentor = async (
  req: Request<{ mentorId: string; userId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    let mentor = (await Mentor.findOne({
      _id: req.params.mentorId,
    })) as IMentor;

    let user = (await User.findOne({
      _id: req.params.userId,
    })) as IUser;

    if (!user && !mentor) {
      throw new http422Error("User or mentor doesn't exist");
    }

    let userMentorRemoved = user.mentors.filter(
      (v) => v._id?.toString() != mentor._id.toString()
    );
    let mentorRemoveUser = mentor.mentoringUser.filter(
      (v) => v._id?.toString() != user._id.toString()
    );

    user.mentors = userMentorRemoved;
    await user.save();

    mentor.mentoringUser = mentorRemoveUser;
    await mentor.save();

    res.status(201).json({ mentor });
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
