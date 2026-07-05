"use client";

import { createContext, useContext, useRef, useCallback, useEffect, useState } from "react";
import { userAuthContext } from "./authContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useContext(userAuthContext);
  const socketRef = useRef();
  const [deliveredMessages,setDeliveredMessages] = useState(null);
  const [seenMessages,setSeenMessages] = useState(null);





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

    socket.on("connect", () => {
      console.log("connection established");
      console.log("CONNECTED", socket.id);
    });


                                
    socketRef?.current?.on("delivered_messages",(data)=>{
      setDeliveredMessages(data.messageIds);
    })


    socketRef.current.on("seen_messages",(data)=>{
      setSeenMessages(data)
    })

  }, [user]);



  
  const disconnectSocket = useCallback(()=>{

    if(socketRef.current){
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("socket disconnected");
      }

  },[])







  // useEffect(()=>{

  //   console.log("socket reff se pehle")

  //   if(!socketRef.current)return;

  //   console.log(socketRef.current,"socket reffff");



  //     console.log("effect chlaaaaa")
    


  // },[deliveredMessages,socketRef.current])


  console.log(deliveredMessages,"delivered")


  return (
    <SocketContext.Provider
      value={{ connectSocket, socketRef ,disconnectSocket,deliveredMessages,seenMessages}}
    >
      {children}
    </SocketContext.Provider>
  );
}
