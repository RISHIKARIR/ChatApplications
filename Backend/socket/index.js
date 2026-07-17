import { Op, where } from "sequelize";
import { conversation, conversation_members } from "../models/conversation.js";
import { mediaModel, messageModel } from "../models/message.js";
import { markPendingMessages } from "./markPendingMessages.js";
import { createUser } from "../models/userModel.js";

const onlineMembers = new Map();
let typingMembers = new Map();

export const initialiseSocket = (io) => {




  io.on("connection", (socket) => {
    console.log("user is connected", socket.id, socket.handshake.query.UserId);
    const userId = Number(socket.handshake.query.UserId);
    socket.join(userId);
    socket.on("join_conversation", async (conversationId) => {
      socket.join(`conversation${conversationId}`);
    });


  

    markPendingMessages(io, userId);

    if (!onlineMembers.has(userId)) {
      onlineMembers.set(userId, new Set());
    }

    onlineMembers.get(userId).add(socket.id);

    console.log(onlineMembers,"onlineeee");


     const currentOnlineMembers =  [...onlineMembers.keys()];


   
     socket.emit("onlineUsers",{
      currentOnlineMembers,
      response : "All online Members"
     })



    socket.broadcast.emit("user-online",{
      userId,
      response : "Online User"
    })



     console.log(currentOnlineMembers,"Currrrrrr")


    socket.on("send_message", async (data) => {
      console.log(data, "ye data ayaaaaa");

      const conversationId = data.conversation_id;
      const message = data.message;
      const isGroup = data.isGroup;
      const senderId = userId;
      const media = data.media

      try {
        const savedMessage = await messageModel.create({
          senderId: userId,
          conversation_id: conversationId,
          message: message,
        });
        

        
        if(media.length > 0){

          const mediaitems = media.map((item)=>{
            return {
              resource_type : item.resource_type,
              url : item.url,
              messageId : savedMessage.id
            }
          })

          await mediaModel.bulkCreate(mediaitems);

           
        }


        const messageWithReceiver = await messageModel.findOne({
          where: {
            id: savedMessage.id,
          },
          include: 
          [
          {
            model: createUser,
            as: "sender"


          },{
            model : mediaModel,
            as : "media"
          }

          ]
          
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
                conversation_id: conversationId,
              },
            },
          );

          savedMessage.isDelivered = true;
        }

        receiverIds.forEach((receiverid) => {
          io.to(Number(receiverid)).emit("new_message", {
            data: messageWithReceiver,
            response: "Sent from backend",
          });
        });

        io.to(Number(userId)).emit("new_message", {
          data: messageWithReceiver,
          response: "Sent from backend",
        });
      } catch (error) {
        console.log(error, "error hai");
      }
    });

    socket.on("edit_message", async (data) => {
      console.log(data, "ifiofhfi");
      const { message, message_id, conversation_id } = data;

      try {
        if (message.trim() === "" || Number.isNaN(Number(message_id))) {
          socket.emit("error", {
            message: "Invalid Input",
          });
          return;
        }

        const affectedrows = await messageModel.update(
          {
            message: message,
            updatedAt: new Date(),
          },
          {
            where: {
              id: message_id,
            },
          },
        );

        const updatedMessage = await messageModel.findOne({
          where: {
            id: message_id,
          },
          include: {
            model: createUser,
            as: "sender",
          },
        });

        io.to(`conversation${conversation_id}`).emit("edited_message", {
          updatedMessage,
        });

        if (affectedrows[0] === 0) {
          socket.emit("error", {
            message: "Saving failed",
          });
        }
      } catch (err) {
        console.log(err, "ifjifj");

        socket.emit("error", {
          message: "Some socket error occured",
        });
      }
    });

    socket.on("delete_message", async (data) => {
      const messageId = data.deletedMessage.id;
      const conversationId = data.deletedMessage.conversation_id;

      try {
        const affectedrows = await messageModel.update(
          { isDeleted: true },
          {
            where: {
              id: messageId,
            },
          },
        );

        const deletedMessage = await messageModel.findOne({
          where: {
            id: messageId,
          },
          include: {
            model: createUser,
            as: "sender"
          },
        });

        if (affectedrows[0] == 0) {
          return res.status(400).json({
            message: "Some socket error occured",
            success: false,
          });
        }

        io.to(`conversation${conversationId}`).emit("deleted_message", {
          deletedMessage,
        });
      } catch (err) {
        return res.status(200).json({
          message: "Some socket error occured",
          sucess: false,
        });
      }
    });

    socket.on("typing", async (data) => {
      const conversationId = data.conversationId;
      const isGroup = data.isGroup;
      const userDetails = data.user;

      if (isGroup) {
        if (!typingMembers.has(conversationId)) {
          typingMembers.set(conversationId, new Map());
        }

        typingMembers.get(conversationId).set(userDetails.id, userDetails.name);
      }

      const payload = {};
      for (const [key, value] of typingMembers) {
        if (!payload[key]) {
          payload[key] = [];
        }

        for (const [innerkey, innerValue] of value) {
          payload[key].push({ userId: innerkey, name: innerValue });
        }
      }

      io.to(`conversation${conversationId}`).emit("typing", {
        conversationId,
        userId,
        typingMembers: typingMembers.size > 0 ? payload : [],
        isGroup: isGroup,
      });
    });

    socket.on("stop_typing", async (data) => {
      const conversationId = data.conversationId;
      const userDetails = data.user;

      console.log(conversationId, "conversationId");
      console.log(userId, "user id");

      for (const [MapconversationId, Members] of typingMembers) {
        if (conversationId == MapconversationId) {
          typingMembers.get(conversationId).delete(userDetails.id);
        }
      }

      const payload = {};
      for (const [key, value] of typingMembers) {
        if (!payload[key]) {
          payload[key] = [];
        }

        for (const [innerkey, innerValue] of value) {
          payload[key].push({ userId: innerkey, name: innerValue });
        }
      }

      console.log(payload, "fjifhf9ij");

      io.to(`conversation${conversationId}`).emit("stop_typing", {
        conversationId,
        userId,
        typingMembers: payload,
      });
    });

    socket.on("mark_seen", async (data) => {
      const conversationId = data.conversationId;

      console.log(data, "user has seen the message");

      const Messages = await messageModel.findAll({
        where: {
          conversation_id: conversationId,
          senderId: {
            [Op.ne]: userId,
          },
          isSeen: false,
        },
      });

      const MarkMessages = await messageModel.update(
        {
          isSeen: true,
        },
        {
          where: {
            conversation_id: conversationId,
            senderId: {
              [Op.ne]: userId,
            },
            isSeen: false,
          },
        },
      );

      let markSeenSender = {};

      for (let Message of Messages) {
        if (!markSeenSender[Message.senderId]) {
          markSeenSender[Message.senderId] = [];
        }

        markSeenSender[Message.senderId].push(Message.id);
      }

      for (const Sender in markSeenSender) {
        io.to(String(Sender)).emit("seen_messages", {
          MessageIds: markSeenSender[Sender],
        });
      }
    });

    socket.on("disconnect", (reason) => {


      socket.broadcast.emit("user-offline",{
        userId
      })

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
