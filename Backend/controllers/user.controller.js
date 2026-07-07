import { uploadTocloudinary } from "../utils/uploadToCloudinary.js"




export const ProfileSave = async (req,res) => {

    console.log("heloooooooooooooooooo")
    try{
    console.log("reqfile",req.file)



    }catch(err){
        console.log(err,"error hai");
        return res.status(500).json({
            message : "Something went wrong",
            success : false,
            error : err
      
        })

    }



}