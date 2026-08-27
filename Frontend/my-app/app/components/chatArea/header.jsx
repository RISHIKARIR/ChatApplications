import React, { useContext, useState } from 'react'
import { SocketContext } from '../../context/socketContext';
import { EllipsisVertical } from 'lucide-react';
import GroupDrawer from '../GroupDrawer';

function Header({selectedConversation,conversationData,conversationUserData,receiverUser,typingMembers,typingUser}) {




   
  
    const [openDrawer, setOpenDrawer] = useState(false);


    
    const { onlineUsers  } = useContext(SocketContext)





  return (
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
              {/* <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Phone size={17} />
              </button> */}

              {/* <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Search size={17} />
              </button> */}

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
  )
}

export default Header