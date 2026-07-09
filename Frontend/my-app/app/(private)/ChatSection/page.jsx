"use client";

import Conversations from "../../components/conversation";
import ChatArea from "../../components/chatarea";
import { useEffect, useRef, useState } from "react";

const ChatSectionPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationUserData, setConversationUserData] = useState(null);
  const [width, setWidth] = useState(380);
  const isDraggable = useRef(false);


  useEffect(() => {
  

    function allowdrag(e) {
      if (!isDraggable.current) return;
      setWidth(e.clientX);
      
    }

    function handleisDraggable() {
      isDraggable.current = false;
    }
    window.addEventListener("mousemove", allowdrag);

    window.addEventListener("mouseup", handleisDraggable);

    return () => {
      window.removeEventListener("mouseup", handleisDraggable);
      window.removeEventListener("mousemove", allowdrag);
    };
  }, []);

  return (
    <>
      <div className="h-screen w-full overflow-hidden bg-[#020202] text-white">
        <div className="flex h-full w-full overflow-hidden bg-[#050505]">
          <aside
          style={{ width }}
          className="h-full min-w-[250px] overflow-hidden border-r border-white/10 bg-[#050505]">
            <Conversations
              setSelectedConversation={setSelectedConversation}
              setConversationUserData={setConversationUserData}
            />
          </aside>
          <div
            className="w-1 cursor-col-resize bg-white/10"
            onMouseDown={() => {
              isDraggable.current = true;
            }}
          />

          <main className="h-full min-w-0 flex-1 overflow-hidden bg-[#050505]">
            <ChatArea
              selectedConversation={selectedConversation}
              conversationUserData={conversationUserData}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default ChatSectionPage;
