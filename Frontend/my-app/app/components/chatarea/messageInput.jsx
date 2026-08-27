import React from 'react'
import Dropdown from "../../../components/dropdown";
import { Paperclip } from 'lucide-react';
import { uploadConfig } from "../../config/uploadconfig";


function messageInput({selectedConversation,handleTyping,message}) {
  return (
      <div className="flex items-center gap-3">
     

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-[#e7e5d8] px-4 shadow-sm">
                <button
                  type="button"
                  className="flex items-center justify-center text-black/70 transition hover:text-black"
                >
                  <Dropdown
                    open={<Paperclip size={17} />}
                    config={uploadConfig}
                    selectedConversation={selectedConversation}
                    setFiles={setFiles}
                    uploading={uploading}
                    openfile={openfile}
                  />
                </button>

                <input
                  onChange={handleTyping}
                  value={message}
                  placeholder="Type something here..."
                  className="h-11 flex-1 bg-transparent text-[12px] font-semibold text-black outline-none placeholder:text-zinc-600"
                ></input>

                <button
                  type="button"
                  className="flex items-center justify-center text-black/60 transition hover:text-black"
                >
                  <Mic size={17} />
                </button>
              </div>

              <button
                onClick={sendMessage}
                type="button"
                disabled={message.trim() === "" && files.length == 0}
                className="flex h-11 w-11 items-center justify-center rounded-md bg-[#8a947f] text-white shadow-lg shadow-black/20 transition hover:bg-[#a6b19a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </div>
  )
}

export default messageInput