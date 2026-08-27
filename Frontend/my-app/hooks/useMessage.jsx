import React from 'react'

export const useMessage = ({setShowChats,setTypingUser,selectedConversation})=>{
    

    const handleNewMessage = (data) => {
      const newMessage = {
        id: data.data.id,
        senderId: data.data.senderId,
        conversation_id: data.data.conversation_id,
        message: data.data.message,
        isDelivered: data.data.isDelivered,
        isSeen: data.data.isSeen,
        isSent: data.data.isSent,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        sender: data.data.sender,
        isDeleted: data.data.isDeleted,
        media: data.data.media,
      };
      console.log(data, "datatatatatata");

      setShowChats((prev) => {
        return {
          ...prev,
          data: [...(prev?.data || []), newMessage],
        };
      });
    };

    function handleditedmessage(data) {
      console.log(data.updatedMessage, "datatatatatata");

      setShowChats((prev) => {
        return {
          ...prev,
          data: prev.data.map((item) =>
            item.id === data.updatedMessage.id ? data.updatedMessage : item,
          ),
        };
      });
    }

    function handleDeletedMessage(data) {
    
      setShowChats((prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: prev?.data?.map((item) =>
            item.id == data.deletedMessage.id ? data.deletedMessage : item,
          ),
        };
      });
    }

    function handleusertyping(data) {
      const userId = Number(data.userId);

      const conversationId = Number(data.conversationId);

      const typing = data.typingMembers;

      if (userId != user.id) {
        setTypingUser({
          userId,
          conversationId,
        });
      }

      setTypingMembers(
        typing[selectedConversation]
          .filter((Member) => Number(Member.userId) != user.id)
          .map((item) => item.name),
      );
    }

    function hanldeStopTyping(data) {
      const userId = Number(data.userId);
      const conversationId = Number(data.conversationId);
      const typing = data.typingMembers;

      setTypingUser((prev) => {
        if (!prev) return;

        if (prev.userId == userId && prev.conversationId == conversationId) {
          return null;
        }

        return prev;
      });

      setTypingMembers(
        typing[selectedConversation]
          ?.filter((member) => member.userId != user.id)
          .map((member) => member.name) ?? [],
      );
    }





}