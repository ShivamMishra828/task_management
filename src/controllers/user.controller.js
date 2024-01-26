import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import mongoose from "mongoose";

const createTask = async (req, res) => {
  try {
    // get data from req.body
    const { title, description, dueDate } = req.body;

    // get userId from req.user by verifyJWT middleware
    const userId = req.user._id;

    // validate data
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedUser: userId,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          tasks: task._id,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task,
      updatedUser,
    });
  } catch (error) {
    console.log(`Error Occured while Creating Task:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Creating Task Controller",
    });
  }
};

const userTaskList = async (req, res) => {
  try {
    // get userId from req.user
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request",
      });
    }

    const userTasks = await User.findById(userId).populate({
      path: "tasks",
      match: {
        status: "Pending",
        dueDate: {
          $gt: new Date(),
        },
      },
      select: "-_id title description dueDate status assignedUser",
    });

    const tasks = userTasks.tasks;

    if (!userTasks) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks Fetched Successfully",
      taskDetails: tasks,
    });
  } catch (error) {
    console.log(`Error Occured while fetch User Task List:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in User Task List Controller",
    });
  }
};

const getTaskDetail = async (req, res) => {
  try {
    // get taskId from req.params
    const { taskId } = req.query;

    // validate taskId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task Id",
      });
    }

    // find Task details corresponding to the taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task Detail fetch successfully",
      task,
    });
  } catch (error) {
    console.log(`Error Occured while fetching Task Detail:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error Occured in Get Task Detail Controller",
    });
  }
};

export { createTask, userTaskList, getTaskDetail };
