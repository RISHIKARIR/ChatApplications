import { Apifetch } from "../../lib/apifetch";



const loadchats = async (selectedConversation,lastMessageId = null )=>{
  if (!selectedConversation) return;


 
  
    let url = `user/${selectedConversation}/messages`;
  
    if(lastMessageId){
      url += `?lastMessageId=${lastMessageId}`
    }
    try{
       console.log(url,"urllllllllllllll")

    const response = await Apifetch(url, {
      method: "GET",
    });
    
    const data = await response.json();
    
    return data;
    }catch(err){
        return err;
    }

}





    export { loadchats }