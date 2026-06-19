"use client";

import React, { useEffect, useState, useContext } from "react";
import NewConvoModal from "./newConvoModal";
import { ModalContext } from "../context/modalContext";
import { userAuthContext } from "../context/authContext";
import { Apifetch } from "../../lib/apifetch";

function Conversation({ setSelectedConversation, setConversationUserData }) {
  const [conversationData, setConversationData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

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
    (member) => Number(member.id) !== Number(user.id)
  );

  return otherUser?.name.toLowerCase().includes(value.toLowerCase().trim());
});

  console.log(conversationData,"ifhihfihjo")

    
    console.log(filtered, "ededwfwfw");
    setFilteredData(filtered);
  }

  async function startConversation() {
    const response = await Apifetch("user/conversations", {
      method: "POST",
    });
  }

  console.log(conversationData, "filteredddd");





  return (
    <div className="flex h-full bg-[#050607] text-white">
      {/* Mini Icon Rail */}
      <div className="hidden h-full w-[56px] shrink-0 flex-col items-center border-r border-white/10 bg-[#090a0c] py-4 lg:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
          C
        </div>

        {/* <div className="mt-8 flex flex-1 flex-col items-center gap-5">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs text-white">
            💬
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-xs text-zinc-500 hover:bg-white/10 hover:text-white">
            🔎
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-xs text-zinc-500 hover:bg-white/10 hover:text-white">
            ⚙
          </button>
        </div> */}

        <div className="relative h-9 w-9 rounded-xl bg-[#1f2937]">
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#090a0c] bg-[#22c55e]" />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex h-full min-w-0 flex-1 flex-col bg-[#0e1013]">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Messages
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Select a conversation
              </p>
            </div>

            <button
              onClick={OpenModal}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-bold text-white transition hover:bg-white hover:text-black"
            >
              +
            </button>
          </div>

          <input
            placeholder="Search"
            onChange={SearchConversations}
            className="w-full rounded-xl border border-white/10 bg-[#090a0c] px-4 py-3 text-xs text-white outline-none placeholder:text-zinc-600 transition focus:border-white/20"
          />

          <div className="mt-4 flex items-center gap-2">
            <button className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-black uppercase text-black">
              All
            </button>
            <button className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase text-zinc-600 hover:text-white">
              Unread
            </button>
            <button className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase text-zinc-600 hover:text-white">
              Groups
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            {filteredData?.map((item) => {
              const otherUser =
                user?.id === item.userOneId ? item.userTwo : item.userOne;
              let chatName;

              if (chatName?.isGroup === true) {
                chatName = "Group chat";
              } else {
                chatName = item?.user_members?.find((value) => {
                  return value?.id != user.id;
                });
              }

              return (
                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/[0.06] active:scale-[0.99]"
                  onClick={() => {
                    setSelectedConversation(item.id);
                    setConversationUserData(item);
                  }}
                  key={item.id}
                >
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1b2028] text-sm font-bold uppercase text-white">
                    {chatName?.name?.charAt(0)}

                    <span className="absolute bottom-[-1px] right-[-1px] h-3 w-3 rounded-full border-2 border-[#0e1013] bg-[#22c55e]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-bold text-white">
                        {chatName?.name}
                      </p>

                      <span className="text-[10px] font-semibold uppercase text-zinc-600">
                        Now
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {chatName?.email}
                    </p>
                  </div>

                  <div className="h-2 w-2 rounded-full bg-white opacity-0 transition group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
