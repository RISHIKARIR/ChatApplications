"use client";
import { Apifetch } from "@/lib/apifetch";
import { createContext, useEffect, useState } from "react";

export const userAuthContext = createContext();

export function Authprovider({ children }) {
  const [user, setUser] = useState(null);

  async function checkAuth() {
    const response = await Apifetch("auth/me", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Something went wrong");
      return;
    }

    setUser(data.User);
  }

  useEffect(() => {
    console.log("Use effect chla kya?");

    checkAuth();
  }, []);

  return (
    <userAuthContext.Provider value={{ user }}>
      {children}
    </userAuthContext.Provider>
  );
}
