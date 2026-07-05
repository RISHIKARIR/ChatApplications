import React, { useEffect, useState, useContext, useRef, use } from "react";
import { toast } from "sonner";
import { userAuthContext } from "../context/authContext";
import { Apifetch } from "../../lib/apifetch";
import { SocketContext } from "../context/socketContext";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditDialog } from "../../components/ui/editDialog";
import { AlertDialogDestructive } from "../../components/ui/deleteDialog";

function ChatArea({ selectedConversation, conversationUserData }) {
  const { user } = useContext(userAuthContext);
  const { connectSocket, socketRef, deliveredMessages, seenMessages } =
    useContext(SocketContext);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  const bottomRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [typingMembers, setTypingMembers] = useState([]);

  console.log(conversationUserData, "convooooooo");

  const convoData = conversationUserData;

  const otherUser = convoData?.user_members?.find((value) => {
    return value.id !== user.id;
  });

  const conversationData = {
    id: convoData?.id,
    chatName: !convoData?.isGroup ? otherUser?.name : "Group Chat",
    users: convoData?.user_members,
    isGroup: convoData?.isGroup,
  };

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
      };
      console.log(data, "datatatatatat");

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
      
    
      
      setTypingMembers(typing[selectedConversation].filter((Member)=>Number(Member.userId) != user.id).map((item)=>item.name))

      setTypingUser((prev) => {
        return {
          userId,
          conversationId,
        };
      });
    }

    function hanldeStopTyping(data) {
      const userId = Number(data.userId);
      const conversationId = Number(data.conversationId);
      const typing = data.typingMembers;


      const memberssss = typing[selectedConversation].filter((member=>member.id != userId))


      setTypingMembers(
        typing[selectedConversation]
          ?.filter((member) => member.userId != user.id)
          .map((member) => member.name) ?? [],
      );

      console.log(typingMembers, "fiifiofiof");

      setTypingUser((prev) => {
        if (!prev) return;

        if (prev.userId == userId && prev.conversationId == conversationId) {
          return null;
        }

        return prev;
      });
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
  }, [sendMessage]);

  console.log(conversationData, "covvoiv0f9f");

  const [showChats, setShowChats] = useState(null);

  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editMessage, setEditmessage] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const timeOutRef = useRef(null);

  useEffect(() => {
    async function loadchats() {
      if (!selectedConversation) return;

      socketRef?.current?.emit("mark_seen", {
        conversationId: selectedConversation,
      });

      socketRef?.current?.emit("join_conversation", selectedConversation);

      const response = await Apifetch(`user/${selectedConversation}/messages`, {
        method: "GET",
      });

      const data = await response.json();

      setShowChats(data);
    }

    loadchats();

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

  function sendMessage() {
    if (message.trim() === "") return;

    if (!selectedConversation) {
      toast.error("Please select a conversation");
      return;
    }

    const socket = socketRef.current;

    if (!socket?.connected) {
      toast.error("Socket not connected");
      return;
    }

    socket.emit("send_message", {
      message: message.trim(),
      conversation_id: selectedConversation,
      isGroup: conversationUserData.isGroup,
    });

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

  function editUserMessage(item) {
    setOpen(true);
    setEditmessage(item);
  }

  function deleteUserMessage(item) {
    setDeleteOpen(true);
    setDeletedMessage(item);
  }

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


  console.log(typingUser,"iofofik")

  return (
    <div className="flex h-full bg-[#050505] text-white">
      <div className="flex h-full min-w-0 flex-1 flex-col bg-[#050505]">
        <div className="flex h-18 items-center justify-between border-b border-white/10 bg-[#050505] px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#1b1b1d] text-sm font-black uppercase text-white ring-1 ring-white/10">
              {selectedConversation
                ? conversationData?.chatName?.charAt(0)
                : "C"}

              {selectedConversation && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#050505] bg-[#22c55e]"></span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {selectedConversation
                  ? conversationUserData.isGroup
                    ? conversationUserData.group_table.Group_name
                    : `${conversationData?.chatName}`
                  : "No Conversation Selected"}
              </h3>

              <p className="mt-1 text-xs text-[#22c55e]">
               {
  selectedConversation
    ? (
        conversationData?.isGroup
          ? (
              typingMembers.length > 1
                ? `${typingMembers.length} Members are typing`
                : typingMembers.length === 1
                  ? `${typingMembers[0]} is typing`
                  : ""
            )
          : (
              typingUser &&
              selectedConversation === typingUser.conversationId
                ? "typing..."
                : ""
            )
      )
    : "Please select a conversation"
}
              </p>
            </div>
          </div>

          {selectedConversation && (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/10 hover:text-white"
              >
                ⌕
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/10 hover:text-white"
              >
                ⦿
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/10 hover:text-white"
              >
                ⋯
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#050505] px-6 py-6">
          {!selectedConversation && (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#101113] text-3xl shadow-xl shadow-black/40">
                  💬
                </div>

                <h2 className="mt-5 text-xl font-bold text-white">
                  Select a conversation
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Choose any conversation from the sidebar to view messages
                  here.
                </p>
              </div>
            </div>
          )}

          {selectedConversation && (
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-700">
                  Today
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <ul className="space-y-6">
                {showChats &&
                  showChats?.data?.map((item) => {
                    return (
                      <li
                        ref={bottomRef}
                        key={item.id}
                        className={`flex ${
                          user.id === item.senderId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {user.id === item.senderId ? (
                          <div className="max-w-[68%] border-l border-[#22c55e] bg-transparent px-4 py-4 text-white">
                            {item.isDeleted ? (
                              "Message Deleted"
                            ) : (
                              <p className="text-sm flex  items-center font-medium leading-relaxed text-zinc-100">
                                {item.message}

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <EllipsisVertical
                                      size={15}
                                      className="opacity-50"
                                      variant="ghost"
                                      // size="icon"
                                    />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="text-white bg-black">
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          editUserMessage(item);
                                        }}
                                      >
                                        <SquarePen /> Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          deleteUserMessage(item);
                                        }}
                                        className="text-red-500 focus:bg-red-400 focus:text-white"
                                      >
                                        <Trash2 /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </p>
                            )}

                            <p className="mt-2 text-right text-[10px] font-semibold text-zinc-600">
                              <span>
                                {item.isSeen
                                  ? "seen "
                                  : item.isDelivered
                                    ? "Delivered "
                                    : "Sent "}
                              </span>

                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        ) : (
                          <div className="flex max-w-[68%] items-start gap-3">
                            <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#17191d] text-xs font-bold uppercase text-white ring-1 ring-white/10 sm:flex">
                              {conversationData.chatName.charAt(0)}
                            </div>

                            <div className="border-l border-white/20 bg-transparent px-4 py-2 text-white">
                              {conversationUserData.isGroup && (
                                <p className="text-xs text-green-500">
                                  {" "}
                                  {item?.sender?.name}
                                </p>
                              )}
                              {item.isDeleted ? (
                                "Message Deleted"
                              ) : (
                                <>
                                  <p className="text-sm font-medium leading-relaxed text-zinc-200">
                                    {item.message}
                                  </p>

                                  <p className="mt-2 text-left text-[10px] font-semibold text-zinc-600">
                                    {new Date(
                                      item.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}

                <EditDialog
                  open={open}
                  setOpen={setOpen}
                  editMessage={editMessage}
                  setEditmessage={setEditmessage}
                />

                <AlertDialogDestructive
                  deleteOpen={deleteOpen}
                  setDeleteOpen={setDeleteOpen}
                  deletedMessage={deletedMessage}
                  setDeletedMessage={setDeletedMessage}
                />
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#050505] px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/10 hover:text-white sm:flex"
            >
              ⊕
            </button>

            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-white/10 bg-[#0d0e10] px-4 transition focus-within:border-white/20">
              <input
                onChange={handleTyping}
                value={message}
                placeholder="Type your message..."
                className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-700"
              ></input>
            </div>

            <button
              onClick={sendMessage}
              type="button"
              disabled={message.trim() === ""}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-black shadow-lg shadow-white/10 transition hover:bg-[#22c55e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↑
            </button>
          </div>

          <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-800">
            End-to-end encrypted messages are private
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
