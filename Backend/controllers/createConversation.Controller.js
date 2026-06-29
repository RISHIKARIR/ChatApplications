import { createUser } from "../models/userModel.js";
import { conversation, groupTable } from "../models/conversation.js";
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
    });

    const conversationIds = existingconversation.map((item) => {
      return item.conversation_id;
    });

    const countIds = conversationIds.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr] = acc[curr] + 1;
      } else {
        acc[curr] = 1;
      }

      return acc;
    }, {});

    const sameIds = Object.entries(countIds)
      .filter(([conversationId, count]) => {
        return count == 2;
      })
      .map(([conversationId]) => {
        return Number(conversationId);
      });

    const isConversationAlreadyExist = await conversation.findAll({
      where: {
        id: { [Op.in]: sameIds },
        isGroup: false,
      },
    });

    console.log(isConversationAlreadyExist, "kya ayaaaa");

    if (isConversationAlreadyExist.length > 0) {
      return res.status(400).json({
        message: "Conversation already exists",
        success: false,
      });
    }

    const Conversation = await conversation.create({});

    const Bothids = {
      user_id: loggedInUserId,
      conversation_id: Conversation.id,
      joined_at: new Date(),
    };

    const Converation_members = await conversation_members.bulkCreate(
      [{
        user_id: loggedInUserId,
        conversation_id: Conversation.id,
        joined_at: new Date(),
      },
      {
        user_id: existinguser.id,
        conversation_id: Conversation.id,
        joined_at: new Date(),
      }]

    );


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


export const createGroup = async(req,res)=>{
  try{
  const { groupName,groupDescription,Members } = req.body;

  if(!groupName || !groupDescription || Members.length==0){
    return res.status(401).json({
      message : "Both fields and Members are required to create a group",
      success : false
    })
  }


  const User = req.user;


  Members.push({id : User.id,name : User.name, email : User.email})





  const Conversation = await conversation.create({
    isGroup : true
  })


  if(!Conversation)return res.status(400).json({
    message : "Conversation couldn't be created",
    success : false
  })

  const Group = await groupTable.create({
    Group_name : groupName,
    Group_image : "",
    Group_Description : groupDescription,
    conversation_id : Conversation.id
  })

  const mappedMembers = Members.map((Member=>{ 
    return {
    user_id : Member.id,conversation_id : Conversation.id,

    joined_at : new Date()
  }
}))

  
  const conversationMembers = await conversation_members.bulkCreate(mappedMembers);



  return res.status(200).json({
    message : "Conversation has been created succesfully",
    success : true
  })

}catch(err){

  console.log(err,"errorrr")

  return res.status(500).json({

    message : "Something went wrong",
    success : false,
    error : err
  })
}


}







