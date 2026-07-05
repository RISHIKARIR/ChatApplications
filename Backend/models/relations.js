import { createUser } from "./userModel.js";
import { conversation } from "./conversation.js";
import { messageModel } from "./message.js";
import { conversation_members } from "./conversation.js";
import { groupTable } from "./conversation.js"; 




createUser.hasMany(messageModel,{
  foreignKey : "senderId",
  as : "sendedMessages"
})

  


messageModel.belongsTo(createUser,{
  foreignKey : "senderId",
  as : "sender"
})




// for group chats

createUser.belongsToMany(conversation,{
foreignKey : "user_id",
otherKey : "conversation_id",
through : conversation_members,
as : "conversations"
})


conversation.belongsToMany(createUser,{
  foreignKey : "conversation_id",
  otherKey : "user_id",
  through : conversation_members,
  as : "user_members"
})
  
conversation.hasOne(groupTable,{
  foreignKey : "conversation_id",
  as : "group_table"
})

groupTable.belongsTo(conversation,{
  foreignKey : "conversation_id",
  as : "conversation"
})








export const AllTables=[createUser,conversation,conversation_members,messageModel]