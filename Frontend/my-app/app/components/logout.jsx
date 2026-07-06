"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useContext } from "react";
import { SocketContext } from "../context/socketContext";




function Logout() {
  const router = useRouter();
  const { disconnectSocket } = useContext(SocketContext)



  async function logoutbtn() {

    disconnectSocket();


    

    const response = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      router.push("/login");
      toast.success("Logout successfull");
    }

  

  }

  return (
    <div className="absolute right-8 top-8 z-50">
      <button
        onClick={logoutbtn}
      >
        <span className="h-2 w-2 rounded-full bg-red-400"></span>
        Logout
      </button>
    </div>
  );
}

export default Logout;