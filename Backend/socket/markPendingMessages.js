import { Op } from "sequelize";
import { conversation, conversation_members } from "../models/conversation.js";
import { messageModel } from "../models/message.js";

export const markPendingMessages = async (io, userId) => {
  const conversationMembers = await conversation_members.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["conversation_id"],
  });

  const conversationIds = conversationMembers.map(
    (item) => item.conversation_id,
  );

  const messages = await messageModel.findAll({
    where: {
      conversation_id: {
        [Op.in]: conversationIds,
      },
      senderId: {
        [Op.ne]: userId,
      },
      isDelivered: false,
    },
  });

  const unDeliveredMessages = messages.map((item) => item.id);

   await messageModel.update(
    { isDelivered: true },
    {
      where: {
        id: {
          [Op.in]: unDeliveredMessages,
        },
      },
    },
  );

  const messagesPerSender = {}

console.log(messages,"ferefrfrf");

  for(let Message of messages){
    if(!messagesPerSender[Message.senderId]){
        messagesPerSender[Message.senderId] = []
    }

      messagesPerSender[Message.senderId].push(Message.id);
    
  }


  for(const Sender in messagesPerSender){
    io.to(String(Sender)).emit("delivered_messages",{
        messageIds : messagesPerSender[Sender]

    })



  }








};
