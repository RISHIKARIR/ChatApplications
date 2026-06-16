import bcrypt from "bcrypt";
import { createUser } from "../models/userModel.js";
import { where } from "sequelize";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    
  const { name, email, password } = req.body;



  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });

  }

  try {
    const exist = await createUser.findOne({ where: { email: email } });

    if (exist) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

  


    


    let accesstokentoken = jwt.sign(
      { email: email },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    let refreshtoken = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accesstoken", accesstokentoken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


      refreshtoken = await bcrypt.hash(refreshtoken,10);

      

    const user = await createUser.create({
      name,
      email,
      password: hashedpassword,
      refreshtoken : refreshtoken
    });



    return res.status(200).json({
      message: "User has been Successfully created",
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err,"ye errror hai");
    return res.status(500).json({
      message: "Something went wrong",
      err : err
      
    });
  }
};
