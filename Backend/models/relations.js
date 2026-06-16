import { createUser } from "./userModel.js";
import { conversation } from "./conversation.js";
import { messageModel } from "./message.js";
import { conversation_members } from "./conversation.js";




createUser.hasMany(messageModel,{
  foreignKey : "senderId",
  as : "sendedMessages"
})

  

createUser.hasMany(messageModel,{
  foreignKey : "receiverId",
  as : "receivedMessages"
})


messageModel.belongsTo(createUser,{
  foreignKey : "senderId",
  as : "sender"
})



messageModel.belongsTo(createUser,{
  foreignKey : "receiverId",
  as : "receiver"

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
  


// conversation.hasMany(conversation_members,{
//   foreignKey : "conversation_id",
//   as : "members"
// })




// conversation_members.belongsTo(conversation,{
//   foreignKey : "conversation_id",
//   as : "conversations"
// })



// createUser.belongsTo(conversation_members){
//   foreignKey : ""
// }






export const AllTables=[createUser,conversation,conversation_members,messageModel]