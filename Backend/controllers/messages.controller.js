
import { messageModel } from "../models/message.js";
import { conversation } from "../models/conversation.js";
import { Op } from "sequelize";
import { createUser } from "../models/userModel.js";





 const showMessages = async (req,res)=>{


  




 const { conversationId } = req.params;



 console.log(req.params,"paramsssssssss");

 



 try{
    if(!conversationId){
    return res.status(400).json({
        message : "Conversation Id is missing",
        success : false
    })
 }

    const existingConversation = await conversation.findOne({
        where : {
            id : conversationId,
            

        [Op.or] : 
            [
                { userOneId : req.user.id },
                { userTwoId : req.user.id }

            ]  
            }        
        
    })


    if(!existingConversation){
        return res.status(401).json({
            message : "User is not authorized to access chat",
            success : false
        })
    }



    const allMessages = await messageModel.findAll({
        where : {
            conversation_id : conversationId
        },
        include : [
            {
                model : createUser,
                as : "sender",
                attributes : ["email","name","id"]
            },
            {
                model : createUser,
                as : "receiver",
                 attributes : ["email","name","id"]
            }
        ]
    })

    

    return res.status(200).json({
        message : "Messages returned successfully",
        success : true,
        data : allMessages
    })


}catch(err){
    console.log(err,"error");
    return res.status(500).json({
        message : "Something went wrong",
        success : false,
        err : err

    })
}

}






const createMessage = async(req,res)=>{
    
    const { receiverId,message } = req.body;
    const { conversationId } = req.params;

    try{

    if(!receiverId || !conversationId || !message){
        return res.status(400).json({
            message : "All fields are required",
            success : false
        })
    }

    if(message.trim() === ""){
        return res.status(400).json({
            message : "Message cannot be empty",
            success : false
        })
    }
    const existingConversation = await conversation.findOne({
        where : {
            id : conversationId,[Op.or] : [ { userOneId : req.user.id},{ userTwoId : req.user.id }]
        }
    })
    if(!existingConversation){
        return res.status(400).json({
            message : "conversation doesn't exist",
            success : false
        })
    }

    const loggedinUserId = Number(req.user.id);
    const receiverUserId = Number(receiverId);
    
    

    const validreceiver = receiverUserId === existingConversation.userOneId || receiverUserId === existingConversation.userTwoId;


    if(!validreceiver || receiverUserId == loggedinUserId)return res.status(400).json({
        message : "Receiver Id is not valid",
        success : false
    })


    // await messageModel.create({
    //     senderId : req.user.id,
    //     receiverId : receiverId,
    //     conversation_id : conversationId,
    //     message : message.trim()

        
    // })


    return res.status(201).json({
        message : "Message sent successfully",
        success : true
    })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message : "Something went wrong",
            success : false,
            err : err
        })
    }





}



export { showMessages,createMessage}