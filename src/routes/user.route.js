import express from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createTask,
  userTaskList,
  getTaskDetail,
  updateTaskDetails,
  deleteTask,
} from "../controllers/task.controller.js";
import {
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Auth Routes
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", verifyJWT, logoutController);

// Task Routes
userRouter.post("/create-task", verifyJWT, createTask);
userRouter.get("/my-tasks", verifyJWT, userTaskList);
userRouter.get("/tasks", verifyJWT, getTaskDetail);
userRouter.put("/update-task", verifyJWT, updateTaskDetails);
userRouter.get("/delete-task", verifyJWT, deleteTask);

// User Routes
userRouter.put("/update", verifyJWT, updateUserProfile);
userRouter.put("/change-password", verifyJWT, changePassword);
userRouter.get("/delete-account", verifyJWT, deleteUserAccount);

export default userRouter;
