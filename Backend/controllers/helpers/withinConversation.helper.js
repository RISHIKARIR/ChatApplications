import { conversation_members } from "../../models/conversation.js";


export const WithinConversation = (socket,handler)=>{
    return async function(payload,callback){

    const userId = Number(socket.handshake.query.UserId);
    const conversationId = payload.conversation_id;

    const conversation = await conversation_members.findOne({
        where : {
            conversation_id : conversationId,
            user_id : userId
        }
    })
    

    if(!conversation){
      return callback({
            success : false,
            message : "Conversation doesn't exist"
        })
    }



    if(conversation.is_left){
        return callback({
            success : false,
            message : "You cannot perform this action anymore since you have left this conversation"
        })
    }


   return handler(payload,callback);




   
    }






}