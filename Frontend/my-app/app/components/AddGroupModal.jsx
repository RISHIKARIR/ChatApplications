"use client";

import React, { useMemo } from "react";
import { Camera, Plus, X, Search, Users,CirclePlus } from "lucide-react";
import Image from "next/image";

function NewGroupChatModal({
  setGroupModal,
  groupModal,
  user,
  conversationData,
}) {
  const allMembers = useMemo(() => {
    let onlyMembers = conversationData.filter((Member) => !Member.isGroup )
    onlyMembers = onlyMembers.flatMap ((Members)=>{

      return Members.user_members.filter((Member)=>{
        
      return Number(Member.id) != Number(user.id)
    
  
      })


     
     

    })
     return onlyMembers;
  }, [conversationData]);

  console.log(allMembers, "9ierhj998h");

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
      onClick={() => {
        setGroupModal(false);
      }}
    >
      <div
        className="flex h-[760px] w-full max-w-[520px] flex-col 
      overflow-hidden rounded-3xl border border-white/10 bg-[#101821] text-white shadow-2xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-bold">New Group Chat</h2>

          <button
            onClick={() => {
              setGroupModal(false);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 px-6 py-5">
          {/* Group Info */}
          <div className="flex gap-4">
            <div className="relative shrink-0">
              <div className="flex h-[74px] w-[74px] items-center justify-center rounded-3xl bg-blue-500/15 text-blue-400">
                <Camera size={26} />
              </div>

              <button
                type="button"
                className="absolute top-14 -right-1 bottom-5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
              >
                <Plus size={15} />
              </button>

              <p className="mt-2 text-center text-[11px] text-white/40">
                Add photo
              </p>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/40">
                  Group Name
                </label>

                <input
                  type="text"
                  defaultValue="e.g. Weekend Trip 🏝️"
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/40">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="What's this group about?"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Members Added */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                Members Added
              </p>

              <span className="text-xs font-medium text-blue-400">0 added</span>
            </div>

            {/* Empty space for added members */}
            <div className="h-[170px] rounded-2xl border border-white/10 bg-white/[0.03]" />
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              type="text"
              placeholder="Search people..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-blue-500"
            />
          </div>

          {/* Suggested */}
          {/* Suggested */}
<div className="mt-5">
  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
    Suggested
  </p>

  <div className="flex max-h-[210px] flex-col overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03]">
    {allMembers.map((Member) => {
      return (
        <div
          key={Member.id}
          className="flex items-center justify-between border-b border-white/10 px-4 py-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <Image
              src={Member.image || "/default-user.png"}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />

            <p className="text-sm font-medium text-white">{Member.name}</p>
          </div>

          <CirclePlus className="h-5 w-5 shrink-0 text-white/60" />
        </div>
      );
    })}
  </div>
</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <p className="text-[11px] text-white/35">
            You can add more people later
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Users size={15} />
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewGroupChatModal;
