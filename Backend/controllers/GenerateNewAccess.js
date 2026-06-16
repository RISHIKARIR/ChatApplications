import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { createUser } from "../models/userModel.js"






export const GenerateNewAccess = async (req,res)=>{

    const token = req.cookies.refreshtoken;

    try {

    if(!token)return res.status(401).json({
        message : "Refresh token expired or Token Invalid",
        success : false,
        data : "refreshexpired"
    })

    const decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET_KEY);

    if(!decoded)return res.status(401).json({
        message : "Token not valid",
        success : false
    })

    let user = await createUser.findOne({where : {email : decoded.email}});

    if(!user)return res.status(401).json({
        message : "User not found",
        success : false
    })


    console.log(user,"user hai");


    const comparedToken = await bcrypt.compare(token,user.refreshtoken);


    if(!comparedToken)return res.status(401).json({
        message : "Token is not matched",
        success : false
    })


    const newaccesstoken = jwt.sign(
        { email : user.email },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn : "15m"}
    )

    const refreshtoken = jwt.sign(
        { email : user.email},
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn :  "7d"}
    )


    res.cookie("accesstoken",newaccesstoken,{
        httpOnly : true,
        secure : false,
        maxAge : 15 * 60 * 1000
    })

    


    res.cookie("refreshtoken",refreshtoken,{
        httpOnly : true,
        secure : false,
        maxAge : 7 * 24 * 60 * 60 * 1000
    
    })


    const hashedrefreshtoken = await bcrypt.hash(refreshtoken,10);


     await createUser.update({refreshtoken : hashedrefreshtoken},{where : {email : user.email}})


    return res.status(200).json({
        message : "Token regenerated succesfully",
        success : true
    })


    }catch(err){



        console.log(err,"internal server error");
        return res.status(500).json({
            message : "Something went wrong",
            success : false,
            data : err
        })
        
    }


}