import { conversation_members } from "../models/conversation.js";
import { io } from "../index.js";

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



export const removeMember = async (req,res)=>{
  try{
    const { conversationId } = req.params;
    const { memberId  } = req.params;
    const user = req.user;

    const isUserBelongs = await conversation_members.findOne({
      where : {
        user_id : memberId,
        conversation_id : conversationId
      }
    })



    if(!isUserBelongs){
      return res.status(400).json({
        message : "User doesn't belong to the required conversation",
        success : false
      })
    }


    const [affectedRows] = await conversation_members.update(
        {is_left : true},
        {
        where : {
          user_id : memberId,
          conversation_id : conversationId
        }
        }

    )

    if(affectedRows == 0){
      return res.status(200).json({
        message : "User not removed from conversation",
        success : false
      })
    }
    

    

    if(affectedRows == 1){
      io.to(conversationId).emit("user_removed",{
        userRemoved : isUserBelongs
      })

      return res.status(200).json({
        message : "User has been removed from the conversation",
        success : true
      })


    }



  }catch(err){
    return res.status(500).json({
      message : "Something went wrong",
      success : false
    })
  }






}



