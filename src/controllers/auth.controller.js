import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    // Get Data from req.body
    const { email, userName, fullName, password, confirmPassword, gender } =
      req.body;

    // Validate data
    if (
      !(email && userName && fullName && password && confirmPassword && gender)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check whether user is already registered
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    // if existing user is founded
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User has already registered",
      });
    }

    // if existing user is not founded, check password and confirm Password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password should match",
      });
    }

    // create new user document
    const user = await User.create({
      email,
      userName,
      fullName,
      password,
      gender,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: createdUser,
    });
  } catch (error) {
    console.log(`Error Occured while Registering User:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Register Controller",
    });
  }
};

const loginController = async (req, res) => {
  try {
    // Get data from req.body
    const { email, userName, password } = req.body;

    // Validate data
    if (!(userName || email) || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check whether the user is registered or not
    const user = await User.findOne({
      $or: [{ userName }, { email }],
    });

    // If no user is founded
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }

    // If user is founded, then compare password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // If Password is correct, then generate a JWT Token
    const payload = {
      id: user._id,
      email: user.email,
      userName: user.userName,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    return res
      .status(200)
      .cookie("jwtToken", jwtToken, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: payload,
        token: jwtToken,
      });
  } catch (error) {
    console.log(`Error Occured while Logging in the User:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Login Controller",
    });
  }
};

const logoutController = async (req, res) => {
  try {
    // User can logout only when the User is already logged in.
    // We will use a middleware to check the User is logged in.
    // If the user is logged in then we have to simply clear cookies from user.

    return res
      .status(200)
      .clearCookie("jwtToken", {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(`Error Occured while logging out the User:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in Logout Controller",
    });
  }
};

export { registerController, loginController, logoutController };
