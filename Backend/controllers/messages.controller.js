import { messageModel } from "../models/message.js";
import { conversation } from "../models/conversation.js";
import { Op } from "sequelize";
import { createUser } from "../models/userModel.js";
import { conversation_members } from "../models/conversation.js";

const showMessages = async (req, res) => {
  const { conversationId } = req.params;

  console.log(req.params, "paramsssssssss");

  try {
    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation Id is missing",
        success: false,
      });
    }

    const isMember = await conversation_members.findOne({
      where: {
        conversation_id: conversationId,
        user_id: req.user.id,
      },
    });

    if (!isMember) {
      return res.status(401).json({
        message: "User is not authorized to access chat",
        success: false,
      });
    }

    const allMessages = await messageModel.findAll({
      where: {
        conversation_id: conversationId,
      },
      include: [
        {
          model: createUser,
          as: "sender",
          attributes: ["email", "name", "id"],
        },
      ],

      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Messages returned successfully",
      success: true,
      data: allMessages,
    });
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      err: err,
    });
  }
};

const createMessage = async (req, res) => {
  const { message } = req.body;
  const { conversationId } = req.params;

  try {
    if (!conversationId || !message) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (message.trim() === "") {
      return res.status(400).json({
        message: "Message cannot be empty",
        success: false,
      });
    }

    const existingConversation = await conversation_members.findOne({
      where: {
        conversation_id: conversationId,
        user_id: req.user.id,
      },
    });
    if (!existingConversation) {
      return res.status(400).json({
        message: "conversation doesn't exist",
        success: false,
      });
    }

    // await messageModel.create({
    //     senderId : req.user.id,
    //     conversation_id : conversationId,
    //     message : message.trim()

    // })

    return res.status(201).json({
      message: "Message sent successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      err: err,
    });
  }
};


const uploadFilesThroughMessages = async (req,res)=>{

  







}









export { showMessages, createMessage };
