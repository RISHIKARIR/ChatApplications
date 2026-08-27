import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
} from "react";
import { toast } from "sonner";
import { userAuthContext } from "../../context/authContext";
import { SocketContext } from "../../context/socketContext";

import ImageShowModal from "../modals/ImageShowModal";
import { loadchats } from "../../services/message.service";
import ChatInput from "./chatInput";
import Messages from "./messages";
import Header from "./header";
import { useMessage } from "../../../hooks/useMessage";

function ChatArea({ selectedConversation, conversationUserData }) {
  const { user } = useContext(userAuthContext);
  const {
    connectSocket,
    socketRef,
    deliveredMessages,
    seenMessages,
    updatedGroup,
  } = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  const bottomRef = useRef(null);
 
 

  const [imageDetails, setImageDetails] = useState(null);
  const [typingMembers, setTypingMembers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);




  const [conversationData, setConversationData] = useState(null);

  const receiverUser = useMemo(() => {
    return conversationData?.users?.find((u) => u.id !== user.id);
  }, [conversationData, user?.id]);

  useEffect(() => {
    if (!conversationUserData) return;

    const otherUser = conversationUserData.user_members.find(
      (u) => u.id !== user.id,
    );

    setConversationData({
      id: conversationUserData.id,
      chatName: conversationUserData.isGroup
        ? conversationUserData.group_table.Group_name
        : otherUser?.name,
      users: conversationUserData.user_members,
      isGroup: conversationUserData.isGroup,
      Profile_img: conversationUserData.isGroup
        ? conversationUserData.group_table.Group_image
        : otherUser?.Profile_img,
      userDetails: conversationUserData.user_members.find(
        (member) => member.id == user.id,
      ),
    });
  }, [conversationUserData]);

  



  useMessage(setShowChats,setTypingUser,selectedConversation)
  


  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

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
      console.log(data.deletedMessage.id, "jifh");



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


    socket.on("new_message", handleNewMessage);

    socket.on("edited_message", handleditedmessage);

    socket.on("deleted_message", handleDeletedMessage);

    socket.on("typing", handleusertyping);

    socket.on("stop_typing", hanldeStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("edited_message", handleditedmessage);

      socket.off("deleted_message", handleDeletedMessage);

      socket.off("typing", handleusertyping);

      socket.off("stop_typing", hanldeStopTyping);
    };
  }, [selectedConversation, user]);

  console.log(conversationData, "covvoiv0f9f");

  const [showChats, setShowChats] = useState(null);

  const [message, setMessage] = useState("");



  const [openImage, setOpenImage] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const timeOutRef = useRef(null);
  const chatMessageRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function showChatsOfcurrentUser() {
      try {
        socketRef?.current?.emit("mark_seen", {
          conversationId: selectedConversation,
        });

        socketRef?.current?.emit("join_conversation", selectedConversation);

        console.log("ye effect chla");

        const response = await loadchats(selectedConversation);
        console.log(response, "ofoifhfiuh");

        setShowChats(response);
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    }

    showChatsOfcurrentUser();

    return () => {
      socketRef?.current?.emit("leave_conversation", selectedConversation);
    };
  }, [selectedConversation]);

  console.log(showChats, "show chatssss");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      ScrollBehavior: "smooth",
    });
  }, [selectedConversation, showChats?.data?.length]);



  useEffect(() => {
    setShowChats((prev) => {
      return {
        ...prev,
        data: prev?.data?.map((item) => {
          return deliveredMessages?.includes(item.id)
            ? { ...item, isDelivered: true }
            : item;
        }),
      };
    });

    setShowChats((prev) => {
      return {
        ...prev,
        data: prev?.data?.map((item) => {
          return seenMessages?.MessageIds?.includes(item.id)
            ? { ...item, isSeen: true }
            : item;
        }),
      };
    });
  }, [deliveredMessages, seenMessages]);





  function handleTyping(e) {
    const value = e.target.value;

    setMessage(value);

    if (!socketRef.current) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", {
        conversationId: selectedConversation,
        isGroup: conversationData?.isGroup,
        user: user,
      });
    }

    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    timeOutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", {
        conversationId: selectedConversation,
        user: user,
        isGroup: conversationData?.isGroup,
      });
      setIsTyping(false);
    }, 10000);
  }



  function handleImageModal(item) {
    setOpenImage(true);
    setImageDetails(item);
  }


  useEffect(() => {
    if (!updatedGroup || !conversationData) return;

    if (updatedGroup.id !== conversationData.id) return;

    console.log(updatedGroup);

    setConversationData({
      id: conversationData.id,
      chatName: conversationData.isGroup
        ? updatedGroup.group_table.Group_name
        : receiverUser?.name,
      users: updatedGroup.user_members,
      isGroup: updatedGroup.isGroup,
      Profile_img: updatedGroup.isGroup
        ? updatedGroup.group_table.Group_image
        : receiverUser?.Profile_img,
    });
  }, [updatedGroup, conversationData?.id]);

  console.log(updatedGroup, "iofjifojfio");

  console.log(conversationData, "mnfifiorriojroi");

  const handlePagination = async () => {
    console.log(chatMessageRef.current.scrollTop, "mfoinfiofnjfoinfi");

    console.log(showChats, "foijfoifjifojfio");

    if (!showChats || !selectedConversation) return;

    if (chatMessageRef.current.scrollTop == 0) {
      const lastMessageId = showChats.data[0].id;

      if (hasMore) {
        const response = await loadchats(selectedConversation, lastMessageId);

        if (response.data.length == 0) {
          setHasMore(false);
        }

        setShowChats((prev) => {
          return {
            ...prev,
            data: [...response.data, ...(prev?.data || [])],
          };
        });
      }
    }
  };



  return (
    <div className="flex h-full bg-[#1c231b] text-white">
      <div className="flex h-full min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_center,#30362f_0%,#242b23_45%,#151c15_100%)]">
      <Header
      selectedConversation={selectedConversation}
      conversationData={conversationData}
     conversationUserData={conversationUserData}
      receiverUser={receiverUser}
     typingMembers={typingMembers}
     typingUser={typingUser}
/>
        <div
          ref={chatMessageRef}
          onScroll={handlePagination}
          className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_center,#30362f_0%,#252b23_48%,#151c15_100%)] px-8 py-6"
        >
          {!selectedConversation && (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#1d241b] text-3xl shadow-xl shadow-black/40">
                  💬
                </div>

                <h2 className="mt-5 text-xl font-bold text-white">
                  Select a conversation
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Choose any conversation from the sidebar to view messages
                  here.
                </p>
              </div>
            </div>
          )}

          {selectedConversation && (
            <Messages
              showChats={showChats}
              bottomRef={bottomRef}
              user={user}
              handleImageModal={handleImageModal}
              conversationData={conversationData}
            />
          )}
        </div>

        {selectedConversation && (
          <div className="bg-[#151c15] px-6 py-4">
              <ChatInput
                conversationData={conversationData}
                selectedConversation={selectedConversation}
                handleTyping={handleTyping}
                message={message}
                conversationUserData={conversationUserData}
              />
            
          </div>
        )}
      </div>

      <ImageShowModal
        setOpenImage={setOpenImage}
        openImage={openImage}
        imageDetails={imageDetails}
        setImageDetails={setImageDetails}
      />
    </div>
  );
}

export default ChatArea;
