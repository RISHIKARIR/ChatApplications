import React, { useContext, useState } from 'react'
import { uploadConfig } from '../../config/uploadconfig'
import Dropdown from '../../../components/dropdown'
import { Paperclip, Mic, Send } from 'lucide-react'
import { SocketContext } from '../../context/socketContext';
import { toast } from 'sonner';
import { Apifetch } from '../../../lib/apifetch';



function ChatInput({ conversationData, selectedConversation, handleTyping, message, sendMessage,conversationUserData }) {

    const [openfile, setOpenFile] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [files,setFiles] = useState([]);




    const { socketRef  } = useContext(SocketContext);

   


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





    async function sendMessage() {
      if (message.trim() === "" && files.length == 0) return;
  
      const response = await uploadFiles();
  
      if (!selectedConversation) {
        toast.error("Please select a conversation");
        return;
      }
  
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


     


  return (
    <>
      {conversationData?.userDetails?.conversation_members
        ?.is_left ? (

          
          
        <div className="text-center font-semibold text-sm">
          <p>
            You cannot Message in this conversation as you are no longer a
            part of it
          </p>
        </div>
      ) : (
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
            disabled={message.trim() === "" && (files?.length ?? 0) === 0}
            className="flex h-11 w-11 items-center justify-center rounded-md bg-[#8a947f] text-white shadow-lg shadow-black/20 transition hover:bg-[#a6b19a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </>
  )
}

export default ChatInput