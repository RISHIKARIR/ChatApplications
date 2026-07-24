import { conversation_members } from "../models/conversation.js";

export const leaveGroup = async (req, res) => {


  try {

    const { conversationId } = req.params;
    const userId = req.user.id;

    const member = await conversation_members.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "You are not a member of this conversation",
        success: false,
      });
    }

    if (member.is_left) {
      return res.status(400).json({
        message: "You have already left this group",
        success: false,
      });
    }

    await member.update({
      is_left: true,
    });

    return res.status(200).json({
      message: "Group left successfully",
      success: true,
      data : member
    });


  } catch (err) {
    console.log(err, "fnnfoifnio");

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};