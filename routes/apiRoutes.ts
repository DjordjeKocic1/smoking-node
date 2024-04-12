import {
  achievementRoutes,
  adminRoutes,
  authorizationRoutes,
  categorieRoutes,
  feedbackRoutes,
  mentorRoutes,
  notificationRoutes,
  paymentRoutes,
  plansRoutes,
  taskRoutes,
  userRoutes,
} from "./restRoutes";

import express from "express";
import { http404Error } from "../errors/errorHandler";
import { viewRoutes } from "./viewRoutes";

require("dotenv").config();

const router = express.Router();

viewRoutes(router);

adminRoutes(router);
userRoutes(router);
plansRoutes(router);
mentorRoutes(router);
taskRoutes(router);
notificationRoutes(router);
categorieRoutes(router);
achievementRoutes(router);
paymentRoutes(router);
feedbackRoutes(router);
authorizationRoutes(router);

//404
router.all("*", (req, res, next) => {
  throw new http404Error(`Requested url:'${req.url}' not found`);
});

export default router;
