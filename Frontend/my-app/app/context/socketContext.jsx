"use client";

import { createContext, useContext, useRef, useCallback, useEffect, useState } from "react";
import { userAuthContext } from "./authContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useContext(userAuthContext);
  const socketRef = useRef();
  const [deliveredMessages,setDeliveredMessages] = useState(null);



  console.log(user, "userrrr ayaa to dikha");

  const connectSocket = useCallback(() => {
    console.log(user, "frewew");

    if (!user) return;

    if (socketRef?.current?.connected) return;

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      query: {
        UserId: user?.id,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connection established");
    });
  }, [user]);



  
  const disconnectSocket = useCallback(()=>{

    if(socketRef.current){
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("socket disconnected");
      }

  },[])



  useEffect(()=>{

    socketRef?.current?.on("delivered_messages",(data)=>{
      console.log(data,"delivered Messages");
      setDeliveredMessages(data);
    })


  },[])


  console.log(deliveredMessages,"delivered")


  return (
    <SocketContext.Provider
      value={{ connectSocket, socketRef ,disconnectSocket,deliveredMessages}}
    >
      {children}
    </SocketContext.Provider>
  );
}
