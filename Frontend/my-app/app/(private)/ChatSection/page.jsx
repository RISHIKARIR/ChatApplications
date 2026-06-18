"use client";

import Conversations from "../../components/conversation";
import ChatArea from "../../components/chatarea";
import { useState } from "react";

const ChatSectionPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationUserData, setConversationUserData] = useState(null);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#020202] text-white">
      <div className="flex h-full w-full overflow-hidden bg-[#050505]">
        <aside className="h-full w-[380px] min-w-[380px] overflow-hidden border-r border-white/10 bg-[#050505]">
          <Conversations
            setSelectedConversation={setSelectedConversation}
            setConversationUserData={setConversationUserData}
          />
        </aside>

        <main className="h-full min-w-0 flex-1 overflow-hidden bg-[#050505]">
          <ChatArea
            selectedConversation={selectedConversation}
            conversationUserData={conversationUserData}
          />
        </main>
      </div>
    </div>
  );
};

export default ChatSectionPage;