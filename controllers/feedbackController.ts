import Feedback from "../model/feedback";
import { IFeedBack } from "../types/types";
import { RequestHandler } from "express";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const getFeedbacks: RequestHandler = async (req, res, next) => {
  try {
    let feedbacks = (await Feedback.find()) as IFeedBack[];
    res.status(200).json({ feedbacks });
  } catch (error) {
    next(error);
  }
};

const createFeedback: RequestHandler<{}, {}, IFeedBack> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const feedback = new Feedback({
      email: req.body.email,
      message: req.body.message,
    });
    await feedback.save();
    res.status(200).send({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const feedbackController = {
  getFeedbacks,
  createFeedback,
};
