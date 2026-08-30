import { useEffect } from "react";

export const useSocketConversation = (
  socketRef,
  setConversationUserData,
  setFilteredData,
  userId
) => {
  const updateLastMessage = (data) => {


    setConversationUserData((prev) => {
      return prev?.map((item) => {
        if (item.id == data.conversationId) {

          return {
            ...item,
            lastmessage: data.lastmessage,
            lastmessageDate: data.lastmessageDate,
            user_members : item.user_members.map((member)=>{
              if(data.senderId == member.id && data.senderId != userId){
                return {...member, conversation_members : {...member.conversation_members,unread_count : (member.unread_count + 1)} }

              }
              return member

            })
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

    console.log(conversationId, "fioifnfnfnf");

    setConversationUserData((prev) => {
      console.log(prev, "nifjfjfddjdbdb");

      return prev.map((conversation) => {
        console.log(conversation.user_members, "userMembers");
        // console.log(...rest,"restttt");
        return {
          ...conversation,
          user_members: conversation.user_members.map((item) => {
            if (item.conversation_members.conversation_id == conversationId) {
              return { ...item, conversation_members : {...item.conversation_members,unread_count : 0} };
            }
            return item;
          }),
        };
      });
    });



    

    setFilteredData((prev) => {
      return prev.map((conversation) => {
        return {
          ...conversation,
          user_members: conversation.user_members.map((item) => {
            if (item.conversation_members.conversation_id == conversationId) {
              return { ...item, conversation_members : {...item.conversation_members,unread_count : 0} };
            }

            return item;
          }),
        };
      });
    });
  };






  socketRef?.current?.on("update_Conversation", updateLastMessage);
  socketRef?.current?.on("remove_unread_count", removeUnreadCount);
};
