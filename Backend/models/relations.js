import { createUser } from "./userModel.js";
import { conversation } from "./conversation.js";
import { messageModel } from "./message.js";
import { conversation_members } from "./conversation.js";
import { groupTable } from "./conversation.js"; 




createUser.hasMany(messageModel,{
  foreignKey : "senderId",
  as : "sendedMessages",
   onDelete : "CASCADE",
    onUpdate : "CASCADE"
})

  


messageModel.belongsTo(createUser,{
  foreignKey : "senderId",
  as : "sender",
   onDelete : "CASCADE",
    onUpdate : "CASCADE"

})




// for group chats

createUser.belongsToMany(conversation,{
foreignKey : "user_id",
otherKey : "conversation_id",
through : conversation_members,
as : "conversations",
 onDelete : "CASCADE",
    onUpdate : "CASCADE"
})


conversation.belongsToMany(createUser,{
  foreignKey : "conversation_id",
  otherKey : "user_id",
  through : conversation_members,
  as : "user_members",
   onDelete : "CASCADE",
    onUpdate : "CASCADE"
})
  
conversation.hasOne(groupTable,{
  foreignKey : "conversation_id",
  as : "group_table",
   onDelete : "CASCADE",
    onUpdate : "CASCADE"
})

groupTable.belongsTo(conversation,{
  foreignKey : "conversation_id",
  as : "conversation",
   onDelete : "CASCADE",
    onUpdate : "CASCADE"
})








export const AllTables=[createUser,conversation,conversation_members,messageModel]