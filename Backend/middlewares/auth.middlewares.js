import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser } from "../models/userModel.js";

export const verifytoken = async (req, res, next) => {
  const token = req.cookies.accesstoken;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Access denied ! Login required",
        success: false,
      });
    }

    const decodedtoken = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

    if (!decodedtoken) {
      return res.status(401).json({
        message: "Token Invalid or token not found",
        success: false,
      });
    }

    const user = await createUser.findOne({
      where: { email: decodedtoken.email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid token or User not found",
        success: false,
      });
    }
    req.user = user;
 
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or Token expired",
      success: false,
    });
  }
};
