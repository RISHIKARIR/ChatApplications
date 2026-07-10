import { Op } from "sequelize";
import { conversation, groupTable } from "../models/conversation.js";
import { conversation_members } from "../models/conversation.js";
import { createUser } from "../models/userModel.js";

export const showConversations = async (req, res) => {
  try {
    const conversations = await createUser.findOne({
      where: {
        id: req.user.id,
      },
      attributes: [],
      include: [
        {
          model: conversation,
          include: [
            {
              model: createUser,
              as: "user_members",
              attributes: ["id", "name", "email","Profile_img"],
              through: { model: conversation_members, attributes: [] },
            },
            { 
              model : groupTable,
              as : "group_table"
            }


          ],
          as: "conversations",
          through: { model: conversation_members, attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: "All conversations Returned",
      succss : true,
      data: conversations,
    });

    // const conversationdIds = conversations.map((item) => {
    //   return item.conversation_id;
    // });

    // const member_details = await conversation_members.findAll({
    //   include: [
    //     {
    //       model: createUser,
    //       as: "user_members",
    //     }
    //   ],
    // });


    return res.status(200).json({
      message: "returned",
      data: conversationdIds,
    });




    return res.status(200).json({
      message: "All conversations",
      // data: conversations,
    });
  } catch (err) {
    console.log(err, "errprrr");
  }
};
