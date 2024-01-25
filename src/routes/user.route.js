import express from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createTask, userTaskList } from "../controllers/user.controller.js";

const userRouter = express.Router();

// Auth Routes
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", verifyJWT, logoutController);

// User Routes
userRouter.post("/create-task", verifyJWT, createTask);
userRouter.get("/my-tasks", verifyJWT, userTaskList);

export default userRouter;
