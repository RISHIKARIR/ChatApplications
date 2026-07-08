"use client";
import { Apifetch } from "@/lib/apifetch";
import { createContext, useEffect, useState } from "react";

export const userAuthContext = createContext();

export function Authprovider({ children }) {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  async function checkAuth() {
      try{
    const response = await Apifetch("auth/me", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Something went wrong");
      return;
    }

    setUser(data.User);
}catch(err){
  console.log(err);
}finally{
  setLoading(false);
}



  }

  useEffect(() => {
    console.log("Use effect chla kya?");

    checkAuth();
  }, []);

  return (
    <userAuthContext.Provider value={{ user,loading }}>
      {children}
    </userAuthContext.Provider>
  );
}
