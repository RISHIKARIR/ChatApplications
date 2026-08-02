import { Apifetch } from "../../lib/apifetch";

const removeUser = async (data) => {

  const MemberId = data.MemberId;
  const conversationId = data.conversationId;

  try {
    const response = await Apifetch(
      `user/${conversationId}/members/${MemberId}`,
      {
        method: "PUT",
      },
    );

    return await response.json();
  } catch (err) {
    return err;
  }
}


const MakeAdmin = async (data)=>{

  const memberId = data.memberId;
  const conversationId = data.conversationId;


    try{
    const response = await Apifetch(`user/${conversationId}/makeAdmin/${memberId}`,{
        method : "PUT"
    })

    return await response.json();

    }catch(err){
        return err;
    }

}




export { removeUser , MakeAdmin };
