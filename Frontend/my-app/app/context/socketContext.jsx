import React from "react";
import { createContext, useContext, useRef,useCallback } from "react";
import { userAuthContext } from "./authContext";

export async function SocketProvider({ children }) {
  const { user } = useContext(userAuthContext);
  const socketRef = useRef();



  const socketContext = createContext();

  const connectSocket = useCallback(() => {
    if (!user) return;





    const socket = io("http://localhost:5000", {
      withCredentials: true,
      query: {
        UserId: user?.id,
      },
    });


    socketRef = socket;






  },[]);


  return <socketContext.Provider>{children}</socketContext.Provider>;
}
