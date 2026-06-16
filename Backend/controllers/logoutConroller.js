import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { createUser } from "../models/userModel.js";





export const logout = async (req,res)=>{
    const token = req.cookies.refreshtoken;
    try{

    if(!token){
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");


        return res.status(200).json({
            message : "Logout successfully",
            success : true
        })
    }



    const decode = jwt.verify(token,process.env.JWT_REFRESH_SECRET_KEY);

    const user = await createUser.findOne({where : {email : decode.email}});


    if(!user)return res.status(400).json({
        message : "User not found",
        success : false
    })



    await createUser.update({refreshtoken : null },{where : { email : decode.email}})
    
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");


    return res.status(200).json({
        message : "Logout successfully",
        success : true
    })
    
    }catch(err){
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        
        res.status(500).json({
            message : "something went wrong",
            success : false,
            err: err
        })
    }

}