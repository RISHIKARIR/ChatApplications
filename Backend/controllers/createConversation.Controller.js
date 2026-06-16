import { createUser } from "../models/userModel.js";
import { conversation } from "../models/conversation.js";
import { conversation_members } from "../models/conversation.js";
import { Op, Sequelize } from "sequelize";

export const createConversation = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(401).json({
        message: "Please Enter a valid email address",
        success: false,
      });
    }

    const existinguser = await createUser.findOne({ where: { email: email } });

    if (!existinguser) {
      return res.status(401).json({
        message: "The user who you want to start a conversation doesn't exists",
        success: false,
      });
    }

    const loggedInUserId = req.user.id;

    if (loggedInUserId == existinguser.id) {
      return res.status(401).json({
        message: "You cannot create a conversation with yourself",
        success: false,
      });
    }

    const existingconversation = await conversation_members.findAll({
      where: {
        user_id: { [Op.in]: [loggedInUserId, existinguser.id] },
      },
      attributes: [
        Sequelize.col("conversation_members_table.conversation_id"),
        "conversation_id",
      ],

      include: [
        {
          model: conversation,
          as: "conversations",
        },
      ],
      group: [
        Sequelize.col("conversation_members_table.conversation_id"),
        Sequelize.col("conversations.id"),
        Sequelize.col("conversations.createdAt"),
        Sequelize.col("conversations.updatedAt"),
      ],
      having: Sequelize.literal('COUNT("user_id") = 2'),
    });

    if (existingconversation.length>0) {
      return res.status(400).json({
        message: "Conversation already exists",
        success: false,
      });
    }

    const ConversationId =  await conversation.create({});

    const date = new Date();



    const Bothids = { user_id :  loggedInUserId,conversation_id : ConversationId.id ,joined_at : date}

   const Converation_members =  await conversation_members.create(Bothids)



    console.log(existingconversation, "iidhihi");

    

    return res.status(200).json({
      message: "Conversation created successfully",
      success: true,
      data: Converation_members,
    });
  } catch (err) {
    console.log(err, "error hai");
    return res.status(401).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
