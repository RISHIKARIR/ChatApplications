import { useEffect } from "react";


export const useSocketConversation = (socketRef,setConversationUserData,setFilteredData) => {
    
 
        const updateLastMessage = (data)=>{



            setConversationUserData((prev)=>{
              return prev?.map((item)=>{
                    if(item.id == data.conversationId){
                        return {...item,lastmessage :data.lastmessage,lastmessageDate : data.lastmessageDate}
                    }
                    return item;

                })
            })

                setFilteredData ((prev)=>{
              return prev?.map((item)=>{
                    if(item.id == data.conversationId){
                        return {...item,lastmessage :data.lastmessage,lastmessageDate : data.lastmessageDate}
                    }
                    return item;

                })
            })





    }
        
        
    
        socketRef?.current?.on("update_Conversation",updateLastMessage)





}