import { Op } from "sequelize"
import { conversation, conversation_members } from "../models/conversation"
import { messageModel } from "../models/message"





const markPendingMessages = async (io,userId)=>{

    const conversationMembers = await conversation_members.findAll({
    where : {
        user_id : userId
    },
    attributes : ["conversation_id"]
    })

    const conversationIds = conversationMembers.map((item=>item.conversation_id))

    const messages = await messageModel.findAll({
        where : {
            conversation_id : {
                [Op.in] : conversationIds 
            },
            senderId : {
                [Op.ne] : userId
            }
        }
    })








}