import { Op } from "sequelize";
import { conversation } from "../models/conversation.js";
import { conversation_members } from "../models/conversation.js";
import { createUser } from "../models/userModel.js";

export const showConversations = async (req, res) => {
  try {
    const conversations = await createUser.findOne({
      where: {
        id: req.user.id,
      },
      attributes : [],
      include: [
        {
          model: conversation,
          include: [
            {
              model: createUser,
              as: "user_members",
              attributes : ["id","name","email"],
              through: { model: conversation_members, attributes: [] },
            },
          ],
          as: "conversations",
          through: { model: conversation_members, attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: "returbed",
      data: conversations,
    });

    const conversationdIds = conversations.map((item) => {
      return item.conversation_id;
    });

    const member_details = await conversation_members.findAll({
      include: {
        model: createUser,
        as: "user_members",
      },
    });

    // console.log(member_details, "convvovovoov");

    return res.status(200).json({
      message: "returned",
      data: conversationdIds,
    });

    // const conversations = await conversation.findAll({
    //   where: {
    //     [Op.or]: [{ userOneId: req.user.id }, { userTwoId: req.user.id }],
    //   },

    //   include:[
    //     {
    //       model : createUser,
    //       as : "userOne"
    //     },
    //     {
    //       model : createUser,
    //       as : "userTwo"
    //     }
    //   ]
    // });

    return res.status(200).json({
      message: "All conversations",
      // data: conversations,
    });
  } catch (err) {
    console.log(err, "errprrr");
  }
};
