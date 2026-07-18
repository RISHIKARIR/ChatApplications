"use client";

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { userAuthContext } from "./authContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useContext(userAuthContext);
  const socketRef = useRef();
  const [deliveredMessages,setDeliveredMessages] = useState(null);
  const [seenMessages,setSeenMessages] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState(null);
  const [newConversation,setNewConversation] = useState(null);





  console.log(user, "userrrr ayaa to dikha");

  const connectSocket = useCallback(() => {
    console.log("connectSocket called");

    if (!user) return;

    if (socketRef?.current?.connected) return;

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      query: {
        UserId: user?.id,
      },
    });

    socketRef.current = socket;

    socketRef?.current?.on("delivered_messages", (data) => {
      setDeliveredMessages(data.messageIds);
    });


    socketRef?.current?.on("onlineUsers",(data)=>{
      console.log(data,"onlineeeeeeeeeeeee")
      setOnlineUsers(data.currentOnlineMembers);
    })


    socketRef?.current?.on("user-online",(data)=>{
      console.log(data,"ye online aya");



      setOnlineUsers((prev)=>{
        return prev.includes(data.userId) ? prev : [...prev,data.userId]
      })
    })


    socketRef?.current?.on("user-offline",(data)=>{
      setOnlineUsers((prev)=>{
        return prev.filter((item)=> item!=data.userId)
      })
    })

    
    socketRef.current.on("seen_messages",(data)=>{
      setSeenMessages(data)
    })


    socketRef.current.on("new_conversation",(data)=>{
      console.log(data,"nfnfifnfi")
      setNewConversation(data.newConversation)
    })


    socketRef?.current?.on("user-online", (data) => {
      setOnlineUsers((prev) => {
        return prev?.includes(data.UserId) ? prev : [...prev, data.UserId];
      });
    });

    socketRef?.current?.on("user-offline", (data) => {
      setOnlineUsers((prev) => {
        return prev?.filter((item) => item != data.userId);
      });
    });

    socketRef.current.on("seen_messages", (data) => {
      setSeenMessages(data);
    });
  }, [user]);




  console.log(onlineUsers,"jijoif ")

  console.log(onlineUsers,"onlineeeeeeeee")



  
  console.log(onlineUsers, "onlineeeeeeeee");

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("socket disconnected");
      }

  },[])



  return (
    <SocketContext.Provider
      value={{ connectSocket,socketRef,newConversation,disconnectSocket,deliveredMessages,seenMessages,onlineUsers}}
    >
      {children}
    </SocketContext.Provider>
  );
}
