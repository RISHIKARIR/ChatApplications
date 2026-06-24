import { Op, where } from "sequelize";
import { conversation, conversation_members } from "../models/conversation.js";
import { messageModel } from "../models/message.js";
import { markPendingMessages } from "./markPendingMessages.js";


const onlineMembers = new Map();

export const initialiseSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("user is connected", socket.id, socket.handshake.query.UserId);
    const userId = socket.handshake.query.UserId;

    socket.join(userId);


          markPendingMessages(io,userId)





    if (!onlineMembers.has(userId)) {
      onlineMembers.set(userId, new Set());
    }

    onlineMembers.get(userId).add(socket.id);

    socket.on("send_message", async (data) => {
      console.log(data, "ye data ayaaaaa");

      const conversationId = data.conversation_id;
      const message = data.message;

      try {

        const savedMessage = await messageModel.create({
          senderId: userId,
          conversation_id: conversationId,
          message: message,
        });

        const members = await conversation_members.findAll({
          where: {
            conversation_id: data.conversation_id,
            user_id: {
              [Op.ne]: userId,
            },
          },
        });

        const receiverIds = members.map((item) => {
          return item.user_id;
        });

        let isReceiverOnline = false;

        for (let i = 0; i < receiverIds.length; i++) {
          if (onlineMembers.has(String(receiverIds[i]))) {
            isReceiverOnline = true;
          }
        }

        console.log(onlineMembers, "online usersss");

        console.log(isReceiverOnline, "user online haiiii???");

        if (isReceiverOnline) {
          await messageModel.update(    
            { isDelivered: true },
            {
              where: {
                conversation_id : conversationId
              },
            },
          );



          savedMessage.isDelivered = true;
        }

        receiverIds.forEach((receiverid) => {
          io.to(String(receiverid)).emit("new_message", {
            data: savedMessage,
            response: "Sent from backend",
          });
        });

        io.to(String(userId)).emit("new_message", {
          data: savedMessage,
          response: "Sent from backend",
        });
      } catch (error) {
        console.log(error, "error hai");
      }
    });


    socket.on("mark_seen",async(data)=>{
      const conversationId = data.conversationId;

      const Messages = await messageModel.findAll(
       {
        where:{
          conversation_id : conversationId,
          senderId : {
            [Op.ne] : userId
          },
          isSeen : false
        }
        }
      )

      const MarkMessages = await messageModel.update({
        isSeen : true
      },
      {
        where : {
          conversation_id : conversationId,
          senderId : {
            [Op.ne] : userId
          },
          isSeen : false
        }
      }
    
    )


    











    })












    socket.on("disconnect", (reason) => {
      const isUserStillonApp = onlineMembers.get(userId);
      if (isUserStillonApp) {
        isUserStillonApp.delete(socket.id);
      }

      if (isUserStillonApp?.size == 0) {
        onlineMembers.delete(userId);
      }

      //   console.log("Disconnected:", reason
    });
  });
};
