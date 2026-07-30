import { conversation_members, GroupAdmins, groupTable } from "../models/conversation.js";



export const isGroupAdmin = async (req,res,next)=>{
    try{
        const user = req.user;
        const { conversationId } = req.params;
        
        const conversation = await groupTable.findOne({
            where : {
                conversation_id : conversationId
            },
            include : {
                model : GroupAdmins,
                as : "groupadmins",
                attributes : ["id","user_id"]
            }
        })

        if(!conversation){
            return res.status(403).json({
                message : "You are not a participant of this conversation",
                success : false
            })
        }

          if(conversation.is_left){
            return res.status(403).json({
                message : "You are not allowed to perform this action in this conversation,since you have left this conversation",
                success : false
            })
        }
        
    const isAdmin = conversation.groupadmins.some((admin)=>admin.user_id===user.id)


      if(isAdmin === false){
        return res.status(403).json({
            message : "You are not an Admin of this conversation",
            success : false,

        })
      }

      else{
            next();
        }

    }catch(err){
        console.log(err,"nbfubfuibfui")
        return res.status(500).json({
            message : "Active Member error occured",
            success : false,
            error : err
        })
    } 





}