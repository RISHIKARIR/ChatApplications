import React, { useEffect, useState, useContext, useRef } from "react";
import { toast } from "sonner";
import { userAuthContext } from "../context/authContext";
import { Apifetch } from "../../lib/apifetch";
import { SocketContext } from "../context/socketContext";

function ChatArea({ selectedConversation, conversationUserData }) {
  const { user } = useContext(userAuthContext);
  const { connectSocket, socketRef, deliveredMessages,seenMessages } =
    useContext(SocketContext);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  const bottomRef = useRef(null);

  console.log(conversationUserData, "convooooooo");

  const convoData = conversationUserData;

  console.log(convoData, "ceojoifjoir");

  const otherUser = convoData?.user_members?.find((value) => {
    return value.id !== user.id;
  });

  const conversationData = {
    id: convoData?.id,
    chatName: !convoData?.isGroup ? otherUser?.name : "Group Chat",
    users: convoData?.user_members,
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
        isDelivered : data.data.isDelivered,
        isSeen : data.data.isSeen,
        isSent : data.data.isSent,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
      };
        console.log(data,"datatatatatat")
      console.log(newMessage,"newwwwwwwwwwwww")


      setShowChats((prev) => {
        return {
          ...prev,
          data: [...(prev?.data || []), newMessage],
        };
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [sendMessage]);

  console.log(conversationData, "covvoiv0f9f");

  const [showChats, setShowChats] = useState(null);

  const [message, setMessage] = useState("");

  console.log(showChats, "femifhiufheius");

  useEffect(() => {
    async function loadchats() {
      if (!selectedConversation) return;

      socketRef?.current?.emit("mark_seen",{
    conversationId : selectedConversation
  })


      const response = await Apifetch(`user/${selectedConversation}/messages`, {
        method: "GET",
      });

      const data = await response.json();

      setShowChats(data);
    }

    loadchats();
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
    });

  setMessage("");
}

  useEffect(() => {

    setShowChats((prev) => {
      return {
        ...prev,
        data: prev?.data?.map((item) => {
          
       return  deliveredMessages?.includes(item.id)
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



    
  }, [deliveredMessages,seenMessages]);


  console.log(seenMessages,"joiweijeijei");


  

  return (
    <div className="flex h-full bg-[#050505] text-white">
      <div className="flex h-full min-w-0 flex-1 flex-col bg-[#050505]">
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 bg-[#050505] px-6">
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
                  ? `${conversationData?.chatName}`
                  : "No Conversation Selected"}
              </h3>

              <p className="mt-1 text-xs text-[#22c55e]">
                {selectedConversation
                  ? "typing..."
                  : "Please select a conversation"}
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
                          <div className="max-w-[68%] border-l border-[#22c55e] bg-transparent px-4 py-2 text-white">
                            <p className="text-sm font-medium leading-relaxed text-zinc-100">
                              {item.message}
                            </p>

                            <p className="mt-2 text-right text-[10px] font-semibold text-zinc-600">
                              <span>
                                {item.isSeen
                                  ? "seen"
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
                              <p className="text-sm font-medium leading-relaxed text-zinc-200">
                                {item.message}
                              </p>

                              <p className="mt-2 text-left text-[10px] font-semibold text-zinc-600">
                                {new Date(item.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
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
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
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

      {/* <aside className="hidden h-full w-[280px] shrink-0 border-l border-white/10 bg-[#0d0e10] xl:block">
        <div className="flex h-full flex-col px-5 py-6">
          {selectedConversation ? (
            <>
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#1b1b1d] text-2xl font-black uppercase text-white ring-1 ring-white/10">
                  {conversationUserData.userTwo.name.charAt(0)}
                </div>

                <h3 className="mt-4 text-sm font-bold text-white">
                  {conversationUserData.userTwo.name}
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  {conversationUserData.userTwo.email}
                </p>

                <div className="mx-auto mt-3 w-fit rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs font-bold text-[#22c55e]">
                  Online
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-[#050505] py-3 text-[10px] font-bold uppercase text-zinc-500 transition hover:text-white"
                >
                  Call
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-[#050505] py-3 text-[10px] font-bold uppercase text-zinc-500 transition hover:text-white"
                >
                  Video
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-[#050505] py-3 text-[10px] font-bold uppercase text-zinc-500 transition hover:text-white"
                >
                  Mute
                </button>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700">
                  Email
                </p>

                <p className="mt-3 break-all text-xs font-medium text-zinc-300">
                  {conversationUserData.userTwo.email}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700">
                    Shared Files
                  </p>

                  <button
                    type="button"
                    className="text-[10px] font-bold uppercase text-[#22c55e]"
                  >
                    See all
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-white/10 bg-[#050505] p-3">
                    <p className="truncate text-xs font-bold text-white">
                      component-audit.pdf
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      2 min ago
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#050505] p-3">
                    <p className="truncate text-xs font-bold text-white">
                      design-notes.fig
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#050505] text-2xl ring-1 ring-white/10">
                  👤
                </div>

                <p className="mt-4 text-sm font-bold text-white">
                  No profile selected
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Select a conversation to view user details.
                </p>
              </div>
            </div>
          )}
        </div>
      </aside> */}
    </div>
  );
}

export default ChatArea;
