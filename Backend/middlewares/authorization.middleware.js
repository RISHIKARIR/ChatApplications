import { conversation_members } from "../models/conversation";

export const isGroupAdmin = async (req, res, next) => {
  const User = req.user;
  const { conversationId } = req.body;

  const isAdmin = await conversation_members.findOne({
    where: {
      conversationId: conversationId,
      role: "ADMIN",
      user_id: User.id,
    },
  });

  if (!isAdmin) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }

  next();
};
