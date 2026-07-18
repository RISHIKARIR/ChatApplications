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
  const [deliveredMessages, setDeliveredMessages] = useState(null);
  const [seenMessages, setSeenMessages] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

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

    socketRef?.current?.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });

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



  
  console.log(onlineUsers, "onlineeeeeeeee");

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("socket disconnected");
    }
  }, []);

  // useEffect(()=>{

  //   console.log("socket reff se pehle")

  //   if(!socketRef.current)return;

  //   console.log(socketRef.current,"socket reffff");

  //     console.log("effect chlaaaaa")

  // },[deliveredMessages,socketRef.current])

  console.log(deliveredMessages, "delivered");

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        socketRef,
        disconnectSocket,
        deliveredMessages,
        seenMessages,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
