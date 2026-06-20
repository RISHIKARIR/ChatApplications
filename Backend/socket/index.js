import { Op } from "sequelize";
import { conversation, conversation_members } from "../models/conversation.js";
import { messageModel } from "../models/message.js";








export const initialiseSocket =  (io)=>{

    
    io.on("connection",(socket)=>{
    
        console.log("user is connected",socket.id,socket.handshake.query.UserId);
        const userId = socket.handshake.query.UserId


        socket.join(userId);


     const onlineMembers = new Map();

    onlineMembers.set(userId,socket.id)

        console.log(onlineMembers,"onlineeeee");


        

    socket.on("send_message",async (data)=>{
        console.log(data,"ye data ayaaaaa");


       const userdetail =  await messageModel.create({
            senderId : userId,
            conversation_id : data.conversation_id,
            message : data.message
       
        })  


  const members =  await conversation_members.findAll({
        where : {
            conversation_id : data.conversation_id,
            user_id : {
                [Op.ne] : userId
            }
        }
    })


    const receiverIds = members.map((item)=>{
        return item.user_id
    })


    receiverIds.forEach((receiverid)=>{
    io.to(String(receiverid)).emit("new_message",{
        data : userdetail,
        response : "Sent from backend"
    })

    })

     io.to(String(userId)).emit("new_message",{
        data : userdetail,
        response : "Sent from backend"
    })



    })    
    
    








    
    })








    
}

