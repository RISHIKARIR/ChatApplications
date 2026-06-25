"use client";

import React, { useContext, useState } from "react";
import { ModalContext } from "../context/modalContext";
import { toast } from "sonner";
import { Apifetch } from "@/lib/apifetch";

function NewConvoModal() {
  const { isOpen, CloseModal } = useContext(ModalContext);
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  async function addNewUser(e) {
    e.preventDefault();

    if (email.trim() === ""){
      toast.error("Email cannot be empty");
      return;
    }

    try {
      const response = await Apifetch("user/conversations", {
        method: "POST",
    
        body: JSON.stringify({ email: email }),
       
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      CloseModal(true);

      console.log(data, "data haiiiii");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div
      onClick={CloseModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] overflow-hidden rounded-[28px] border border-[#253244] bg-[#0f1720] shadow-2xl shadow-black/50"
      >
        <div className="border-b border-[#223041] px-7 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#22c55e]">
                New Chat
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Start New Conversation
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Enter the user email address to add them to your chat list.
              </p>
            </div>

            <button
              type="button"
              onClick={CloseModal}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2d3b4f] bg-[#111c28] text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
            >
              ✕
            </button>
          </div>
        </div>

        <form className="px-7 py-6" onSubmit={addNewUser}>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            User Email
          </label>

          <input
            type="email"
            placeholder="example@email.com"
            className="w-full rounded-2xl border border-[#2d3b4f] bg-[#111c28] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />

          <div className="mt-7 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={CloseModal}
              className="rounded-2xl border border-[#2d3b4f] bg-[#111c28] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#1b2838] active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-[#22c55e] px-5 py-3 text-sm font-bold text-[#07130c] shadow-lg shadow-[#22c55e]/20 transition hover:bg-[#4ade80] active:scale-[0.98]"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewConvoModal;