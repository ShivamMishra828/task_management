import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    // Get toke from req.cookies
    const { jwtToken } = req.cookies;

    // if token is not present
    if (!jwtToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request",
      });
    }

    const decodedData = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedData.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Access Token",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`Error Occured while verifying JWT Token:- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error in VerifyJWT Middleware",
    });
  }
};

export default verifyJWT;
