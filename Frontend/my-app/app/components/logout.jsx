"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function Logout() {
  const router = useRouter();

  async function logoutbtn() {
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

    Socket

  }

  return (
    <div className="absolute right-8 top-8 z-50">
      <button
        onClick={logoutbtn}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-[#1f1518] px-4 py-2.5 text-sm font-bold text-red-400 shadow-lg shadow-black/30 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500 hover:text-white active:scale-95"
      >
        <span className="h-2 w-2 rounded-full bg-red-400"></span>
        Logout
      </button>
    </div>
  );
}

export default Logout;