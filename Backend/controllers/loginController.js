import { createUser } from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { conversation } from "../models/conversation.js";
import { Op } from "sequelize";

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both credentials",
        success: false,
      });
    }

    const user = await createUser.findOne({ where: { email: email } });

    console.log(user, "user hai");

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist",
        success: false,
      });
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(400).json({
        message: "Please Enter a Valid email or password",
        success: false,
      });
    }

    const accesstoken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15h",
      },
    );

    const refreshtoken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false,
      maxAge:  15 * 60 * 60 * 1000,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    const hashedrefreshtoken = await bcrypt.hash(refreshtoken,10);

    
    await user.update({refreshtoken : hashedrefreshtoken});



    return res.json({
      message: "User logged in Succesfully",
      success: true,
    });
  } catch (err) {
    console.log(err, "rjijirji");
    return res.json({
      message: "Something went wrong",
      success: false,
      err: err,
    });
  }
};




