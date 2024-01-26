import User from "../models/user.model.js";

const updateUserProfile = async (req, res) => {
  try {
    // get data from req.body
    const { email, userName, fullName, gender } = req.body;

    // validate data
    if (!(email || userName || fullName || gender)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // get userId from req.user
    const userId = req.user._id;

    // find user corressponding to userID and update details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        userName,
        fullName,
        gender,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User Details Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(`Error Occured while Updating User Profile:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Update User Profile Controller",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // get data from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // validate data
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // get userId from req.user
    const userId = req.user._id;

    // get user details from userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm New Password doesn't match",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: newPassword,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Password Changed Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(`Error Occured while Changing Password:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Change Password Controller",
    });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    // get userId from req.user
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "User Account deleted successfully",
    });
  } catch (error) {
    console.log(`Error Occured while Deleting User Account:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error Occured in Delete Account Controller",
    });
  }
};

export { updateUserProfile, changePassword, deleteUserAccount };
