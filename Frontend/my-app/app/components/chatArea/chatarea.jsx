import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  use,
  useMemo,
} from "react";
import { toast } from "sonner";
import { userAuthContext } from "../../context/authContext";
import { Apifetch } from "../../../lib/apifetch";
import { SocketContext } from "../../context/socketContext";
import { Button } from "@/components/ui/button";
import GroupDrawer from "../GroupDrawer";
import {
  EllipsisVertical,
  Trash2,
  SquarePen,
  Phone,
  Search,
  Grid2X2,
  Menu,
  Trash2Icon,
} from "lucide-react";
import { uploadConfig } from "../../config/uploadconfig";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditDialog } from "../../../components/ui/editDialog";
import { AlertDialogDestructive } from "../../../components/ui/deleteDialog";
import Dropdown from "../../../components/dropdown";
import ImageShowModal from "../modals/ImageShowModal";
import { loadchats } from "../../services/message.service";
import ChatInput from "./chatInput";
import Messages from "./messages";

function ChatArea({ selectedConversation, conversationUserData }) {
  const { user } = useContext(userAuthContext);
  const {
    connectSocket,
    socketRef,
    deliveredMessages,
    seenMessages,
    onlineUsers,
    updatedGroup,
  } = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  const bottomRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [typingMembers, setTypingMembers] = useState([]);
  const [files, setFiles] = useState([]);
  const [imageDetails, setImageDetails] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  console.log(conversationUserData, "convooooooo");

  let convoData = conversationUserData;

  console.log(updatedGroup, "ifjoirjiorjf");
  console.log(convoData, "oifhoifhiofh");

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

  //
  console.log(conversationUserData, "oniongoijn");
  console.log(conversationData, "ufuifuifuifiufuifhiufhfuih");

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

      console.log(data, deletedMessage, "fjibfb");

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

    console.log(typingMembers, "fiifiofiof");

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
  }, [sendMessage]);

  console.log(conversationData, "covvoiv0f9f");

  const [showChats, setShowChats] = useState(null);

  const [message, setMessage] = useState("");





  const [uploading, setUploading] = useState(false);
  const [openfile, setOpenFile] = useState(true);
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

  async function sendMessage() {
    if (message.trim() === "" && files.length == 0) return;

    const response = await uploadFiles();

    if (!selectedConversation) {
      toast.error("Please select a conversation");
      return;
    }

    console.log(response, "responseeee");

    setOpenFile(false);

    const socket = socketRef.current;

    if (!socket?.connected) {
      toast.error("Socket not connected");
      return;
    }

    setFiles([]);

    socket.emit(
      "send_message",
      {
        message: message.trim(),
        conversation_id: selectedConversation,
        isGroup: conversationUserData.isGroup,
        media: files.length > 0 ? response.urls : [],
      },
      (response) => {
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      },
    );

    setMessage("");
  }

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

  async function uploadFiles() {
    setOpenFile(true);

    if (files.length == 0) return [];
    try {
      setUploading(true);

      const formdata = new FormData();

      files.forEach((file) => {
        formdata.append("files", file);
      });

      const response = await Apifetch("user/media/uploadMedia", {
        method: "POST",
        body: formdata,
      });

      if (!response.ok) {
        console.log(err, "errorrr");
        return;
      }

      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  }

  function handleImageModal(item) {
    setOpenImage(true);
    setImageDetails(item);
  }

  async function deleteMessage() {
    const socket = socketRef.current;

    if (!socket) return;

    socket.emit("delete_message", {
      deletedMessage,
    });
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

  console.log(showChats?.data, "fniufhuifhuif");

  return (
    <div className="flex h-full bg-[#1c231b] text-white">
      <div className="flex h-full min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_center,#30362f_0%,#242b23_45%,#151c15_100%)]">
        <div className="flex h-16 items-center justify-between border-b border-black/20 bg-[#182017]/95 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#d8d0b8] text-sm font-black uppercase text-black ring-1 ring-white/10">
              {selectedConversation ? (
                conversationData?.Profile_img ? (
                  <img
                    src={conversationData?.Profile_img}
                    className="flex h-10 rounded-full  w-10 items-center justify-center text-xl font-bold text-zinc-500"
                  ></img>
                ) : (
                  conversationData?.chatName?.charAt(0)
                )
              ) : (
                "C"
              )}

              {selectedConversation && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#182017] bg-[#22c55e]"></span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold leading-none text-white">
                {selectedConversation
                  ? conversationData?.chatName
                  : "No Conversation Selected"}
              </h3>

              <p className="mt-1 text-[10px] font-medium text-zinc-400">
                {selectedConversation
                  ? conversationData?.isGroup
                    ? typingMembers.length > 1
                      ? `${typingMembers.length} Members are typing`
                      : typingMembers.length === 1
                        ? `${typingMembers[0]} is typing`
                        : ""
                    : typingUser &&
                        selectedConversation === typingUser.conversationId
                      ? "typing..."
                      : onlineUsers?.includes(receiverUser?.id)
                        ? "Active"
                        : ""
                  : "Please select a conversation"}
              </p>
            </div>
          </div>

          {selectedConversation && (
            <div className="hidden items-center gap-4 sm:flex">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Phone size={17} />
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Search size={17} />
              </button>

              <div className="h-7 w-px bg-white/20" />

              <button
                type="button"
                onClick={() => {
                  setOpenDrawer(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <EllipsisVertical size={17} />
              </button>

              <GroupDrawer
                open={openDrawer}
                setOpen={setOpenDrawer}
                data={conversationUserData}
              />
            </div>
          )}
        </div>

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
            {conversationData?.userDetails?.conversation_members_table
              ?.is_left ? (
              <div className="text-center font-semibold text-sm">
                <p>
                  You cannot Message in this conversation as you are no longer a
                  part of it
                </p>
              </div>
            ) : (
              <ChatInput
                selectedConversation={selectedConversation}
                setFiles={setFiles}
                uploading={uploading}
                openfile={openfile}
                handleTyping={handleTyping}
                message={message}
                sendMessage={sendMessage}
                files={files}
              />
            )}
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
