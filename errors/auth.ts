import { RequestHandler } from "express";
import User from "../model/user";
import { http401Error } from "./errorHandler";
import jwt from "jsonwebtoken";

export const verifyHeaderToken: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) throw new http401Error("Access denied. No token provided.");
  jwt.verify(token, process.env.SESSION_SECRET as string, (error: any) => {
    if (error) {
      throw new http401Error("Token expired or invalid.");
    } else {
      next();
    }
  });
};

export const verifyHeaderTokenAdmin: RequestHandler = async (
  req,
  res,
  next
) => {
  const token = req.header("Authorization");
  if (!token) throw new http401Error("Access denied. No token provided.");
  let decoded = jwt.verify(token, process.env.SESSION_SECRET as string) as {
    email: string;
  };
  let email = decoded.email;
  let user = await User.findOne({ email, roles: "admin" });
  if (!user) {
    throw new http401Error("You are not authorized to access this page");
  } else {
    next();
  }
};
