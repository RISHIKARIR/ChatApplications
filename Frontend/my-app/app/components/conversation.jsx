"use client";

import React, { useEffect, useState, useContext } from "react";
import NewConvoModal from "./newConvoModal";
import { ModalContext } from "../context/modalContext";
import { userAuthContext } from "../context/authContext";
import { Apifetch } from "../../lib/apifetch";
import { Users } from "lucide-react";
import AddGroupModal from "./AddGroupModal";
import CustomModal from "../../components/ui/modal";
import { NavUser } from "../../components/ui/navbar";

function Conversation({ setSelectedConversation, setConversationUserData }) {
  const [conversationData, setConversationData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [groupModal, setGroupModal] = useState(false);
  const [open, setOpen] = useState(false);

  const { OpenModal } = useContext(ModalContext);
  const { user } = useContext(userAuthContext);

  useEffect(() => {
    async function fetchdata() {
      const response = await Apifetch("user/conversations", {});
      const data = await response.json();

      console.log(data, "data ");

      setConversationData(data.data.conversations);
      setFilteredData(data.data.conversations);
    }

    fetchdata();
  }, []);

  console.log(conversationData, "iheiubfefmlk");

  function SearchConversations(event) {
    console.log(event.target.value, "eventtt");

    const value = event.target.value.toLowerCase();

    const filtered = conversationData.filter((conversation) => {
      const otherUser = conversation.user_members?.find(
        (member) => Number(member.id) !== Number(user.id),
      );

      return otherUser?.name.toLowerCase().includes(value.toLowerCase().trim());
    });

    console.log(conversationData, "ifhihfihjo");

    console.log(filtered, "ededwfwfw");
    setFilteredData(filtered);
  }




  return (
    <>
      {groupModal && (
        <AddGroupModal
          setGroupModal={setGroupModal}
          groupModal={groupModal}
          user={user}
          conversationData={conversationData}
        />
      )}

      <div className="flex h-full bg-[#1f261d] text-white">
        {/* Mini Icon Rail */}
        <div className="hidden h-full w-[58px] shrink-0 flex-col items-center bg-[#121811] py-4 lg:flex">
          <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-md bg-white text-sm font-black text-black">
            C
          </div>

          <div className="flex flex-1 flex-col items-center gap-5 text-zinc-300">
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              ⌂
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              ▢
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              ♧
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              □
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              ▭
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-white">
              ▦
            </button>
          </div>

          <div className="mb-3 flex flex-col items-center gap-3">
            <p className="text-[8px] font-bold uppercase text-white">
              Messages
            </p>

         
          </div>

          <div className="relative mt-auto h-9 w-9 rounded-full bg-[#d8d0b8] text-black">
            <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#121811] bg-[#22c55e]" />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex h-full min-w-0 flex-1 flex-col bg-[#1d241b]">
          <div className="px-4 pt-4"
            
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-end gap-2">
                <h2 className="text-[15px] font-bold tracking-tight text-white">
                  Message
                </h2>
                <span className="mb-[1px] text-[9px] font-semibold text-zinc-400">
                  20 new
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={OpenModal}
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-base font-bold text-zinc-300 transition hover:cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  +
                </button>

                <span
                  onClick={() => {
                    setGroupModal(true);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-white transition hover:cursor-pointer hover:bg-white/10"
                >
                  <Users size={14} />
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                placeholder="Search Chat..."
                onChange={SearchConversations}
                className="h-8 w-full rounded-md border-none bg-white px-3 pr-8 text-[10px] font-semibold text-black outline-none placeholder:text-zinc-500"
              />

              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-black">
                ⌕
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button className="rounded-md bg-white px-3 py-1.5 text-[9px] font-black uppercase text-black">
                All
              </button>
              <button className="rounded-md px-3 py-1.5 text-[9px] font-bold uppercase text-zinc-400 transition hover:bg-white/10 hover:text-white">
                Unread
              </button>
              <button className="rounded-md px-3 py-1.5 text-[9px] font-bold uppercase text-zinc-400 transition hover:bg-white/10 hover:text-white">
                Groups
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-300">
                All Message
              </p>
            </div>

            <div className="space-y-1">
              {filteredData?.map((item) => {
                const otherUser =
                  user?.id === item.userOneId ? item.userTwo : item.userOne;

                let chatName = { name: "" };

                if (item.isGroup) {
                  chatName.name = item?.group_table?.Group_name;
                } else {
                  chatName = item?.user_members?.find((value) => {
                    return value?.id != user.id;
                  });
                }

                return (
                  <button
                    type="button"
                    className="group flex w-full items-center gap-2 rounded-md px-1.5 py-2 text-left transition hover:bg-white/10 active:scale-[0.99]"
                    onClick={() => {
                      setSelectedConversation(item.id);
                      setConversationUserData(item);
                    }}
                    key={item.id}
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d8d0b8] text-[11px] font-black uppercase text-black">
                      {chatName?.name?.charAt(0)}

                      <span className="absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 rounded-full border-2 border-[#1d241b] bg-[#22c55e]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] font-bold text-white">
                          {chatName?.name}
                        </p>

                        <span className="text-[8px] font-semibold uppercase text-zinc-300">
                          12 pm
                        </span>
                      </div>

                      <p className="mt-[2px] truncate text-[9px] font-medium text-zinc-400">
                        {chatName?.email}
                      </p>
                    </div>

                    <div className="h-4 min-w-4 rounded-full bg-[#7c5cff] px-1 text-center text-[9px] font-bold leading-4 text-white opacity-0 transition group-hover:opacity-100">
                      2
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-black/20 bg-[#1b2119] px-3 py-3">
            <div className="flex items-center gap-2">
           

              <div className="min-w-0 flex-1">
             
                
                <div>
                  <NavUser user={user}/>
                 
                  </div>
              
              </div>

              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-black">
                ◕
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-black">
                ◔
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Conversation;
