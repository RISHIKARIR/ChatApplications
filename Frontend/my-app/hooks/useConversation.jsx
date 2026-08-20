import { useEffect } from "react";

export const useSocketConversation = (
  socketRef,
  setConversationUserData,
  setFilteredData,
) => {
  const updateLastMessage = (data) => {
    setConversationUserData((prev) => {
      return prev?.map((item) => {
        if (item.id == data.conversationId) {
          return {
            ...item,
            lastmessage: data.lastmessage,
            lastmessageDate: data.lastmessageDate,
          };
        }
        return item;
      });
    });

    setFilteredData((prev) => {
      return prev?.map((item) => {
        if (item.id == data.conversationId) {
          return {
            ...item,
            lastmessage: data.lastmessage,
            lastmessageDate: data.lastmessageDate,
          };
        }
        return item;
      });
    });
  };

  const removeUnreadCount = (data) => {
    const { conversationId } = data;

    setConversationUserData((prev) => {
      return prev.map(({ user_members, ...rest }) => {
        return {
          ...rest,
          user_members: user_members.map((item) => {
            if (item.conversation_members.conversation_id == conversationId) {
              return { ...item, unread_count: 0 };
            }

            return item;
          }),
        };
      });
    });




    setFilteredData((prev)=>{
        return prev.map(({user_members,...rest })=>{
            return {...rest,
            user_members :  user_members.map((item)=>{
                if(item.conversation_members.conversation_id == conversationId){
                return {...item,unread_count : 0}  
            }  

            return item;
})

}

        })



    })









  };

  socketRef?.current?.on("update_Conversation", updateLastMessage);
  socketRef?.current?.on("remove_unread_count", removeUnreadCount);
};
