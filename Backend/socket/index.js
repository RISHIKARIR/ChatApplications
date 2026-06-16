import { conversation } from "../models/conversation.js";
import { messageModel } from "../models/message.js";








export const initialiseSocket =  (io)=>{

    
    io.on("connection",(socket)=>{
    
        console.log("user is connected",socket.id,socket.handshake.query.UserId);
        const userId = socket.handshake.query.UserId


        socket.join(userId);
        

    socket.on("send_message",async (data)=>{
        console.log(data,"ye data ayaaaaa");


       const userdetail =  await messageModel.create({
            senderId : userId,
            receiverId : data.receiverId,
            conversation_id : data.conversation_id,
            message : data.message
       
        })  

        


        console.log(userdetail,"userrrrrrrrr")


    io.to(String(data.receiverId)).emit("new_message",{
        data : userdetail,
        response : "Sent from backend"
    })


     io.to(String(userId)).emit("new_message",{
        data : userdetail,
        response : "Sent from backend"
    })



    })    
    
    








    
    })








    
}

