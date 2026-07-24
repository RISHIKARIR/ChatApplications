import { conversation_members } from "../models/conversation";



const isActiveMember = async (req,res,next)=>{
    try{
        const user = req.user;
        const { conversationId } = req.params;
        
        
      const conversation =  await conversation_members.findOne({
            where : {
                conversation_id : conversationId,
                user_id : user.id
                
            }
        })

        if(!conversation){
            return res.status(403).json({
                message : "You are not a member of this conversation",
                success : false
            })
        }


        if(conversation.is_left){
            return res.status(403).json({
                message : "You are not allowed to perform this action in this conversation,since you have left this conversation",
                success : false
            })
        }else{
            next();
        }





    }catch(err){
        return res.status(500).json({
            message : "Active Member error occured",
            success : false
        })
    } 





}