"use client";

import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Filter,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  Mail,
  SquarePen,
} from "lucide-react";
import { Apifetch } from "../../../lib/apifetch";
import { toast } from "sonner";
import { useContext } from "react";
import { userAuthContext } from "../../context/authContext";
import { profileUser } from "../../config/profile";

function page() {
  const uploadRef = useRef(null);

  const { user } = useContext(userAuthContext);

  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setFormData] = useState({name : "",email : "",image : ""});

  const userArray = profileUser(user);

  async function setPreviewImage(e) {
   

    const savefile = e.target.files[0];

 

    const previewUrl = URL.createObjectURL(savefile);

    console.log(previewUrl, "previewww");
    setPreview(previewUrl);

  

    if (!response.ok) {
      toast.error("File upload Failed");
    }

    console.log("upload image");
  }




  function uploadImage(){





  }


  console.log(form,"formDataaaa");

  

  return (
    <div className="min-h-screen bg-[#222126] flex justify-center text-white ">
      <div className="mx-auto flex items-center justify-center w-full  rounded-2xl border border-white/5 bg-[#0d0b10] shadow-2xl shadow-black/30">
        {/* Left Sidebar */}

        {/* Main Content */}
        <main className="min-w-0  justify-center bg-[#0d0b10]">
          {/* Top Bar */}
          <div className="flex flex-col items-center gap-4 border-b border-white/5 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#282633] text-zinc-300">
                <User size={22} />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-white">
                  Account Settings
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Here you can update information about your account
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-65">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type=""
                  placeholder="Search..."
                  className="h-9 w-full rounded-md border border-white/5 bg-[#25222b] pl-9 pr-12 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#6d35ff]/60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">
                  ⌘F
                </span>
              </div>

              <button className="flex h-9 items-center justify-center gap-2 rounded-md border border-white/5 bg-[#272530] px-4 text-sm font-semibold text-white transition hover:bg-[#322f3c]">
                <Filter size={15} />
                Filter
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="px-5 py-6 sm:px-6 lg:px-7">
            <section className="max-w-135">
              {/* Profile Upload */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#2b2934]">
                  {/* image space */}

                  {preview ? (
                    <img
                      src={preview || user?.name.charAt(0)}
                      className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-500"
                    ></img>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-500 text-xl font-bold text-zinc-900">
                      <p> {user?.name.charAt(0)} </p>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200">
                    Upload a profile picture to personalize your workspace and
                    help collaborators identify you.
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    The recommended size is 400x400px and less than 1Mb.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        uploadRef.current.click();
                      }}
                      className="flex h-8 items-center gap-2 rounded-md bg-[#2a2731] px-3 text-xs font-semibold text-zinc-100 transition hover:bg-[#34313d]"
                    >
                      <Upload size={13} />
                      Change Profile
                    </button>
                    <input
                      type="file"
                      className="hidden"
                      ref={uploadRef}
                      onChange={setPreviewImage}
                    ></input>

                    <button className="flex h-8 items-center gap-2 rounded-md bg-[#2a2731] px-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/10">
                      <Trash2 size={13} />
                      Remove Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-5">
                  {userArray?.map((item, idx) => {
                    const isEditing = editing === idx;

                    return (
                      <div key={idx}>
                        <div className="flex font-medium gap-5 text-xs">
                          <label className="mb-2 flex items-center text-xs font-medium text-zinc-500">
                            {item.icon}
                          </label>

                          <div className="flex font-medium gap-1 text-xs flex-col">
                            {item.label}

                            {isEditing ? (
                              <div>
                                <input
                                  className="h-10 w-full rounded-md border border-white/5 bg-[#24212a] px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#6d35ff]/60"
                                  placeholder="Enter the name"
                                  defaultValue={item.user}
                                  name={item.name}
                                  
                                  value={form[item.name]}
                                  onChange={(e)=>{
                                    setFormData((prev)=>{
                                      return {
                                        ...prev,
                                        [item.name] : e.target.value
                                      }

                                    })

                                  }}
                                ></input>
                                <div className="flex my-3 gap-3">
                                  <button className="p-2 bg-[#6d35ff] border rounded-lg"
                                  onClick={()=>{ setEditing(null)   }}
                                  >
                                    {" "}
                                    Save{" "}
                                  </button>
                                  <button
                                    className="p-2 bg-transparent border rounded-lg"
                                    onClick={() => {
                                      setEditing(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-5 ">
                                <p className="text-xs font-medium">
                                 {form[item.name].trim() !== "" ?  form[item.name] :  item.user }
                                </p>
                                <button
                                  onClick={() => {
                                    setEditing(idx);
                                  }}
                                >
                                  <SquarePen size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* <div className="flex font-medium gap-1 text-xs flex-col">
                    
                    
                    
                     Name   
                  <p className="text-xs font-medium"> {user?.name} </p>
                  </div> */}
                  {/* <input
                    placeholder="First name"
                    className="h-10 w-full rounded-md border border-white/5 bg-[#24212a] px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#6d35ff]/60"
                  /> */}
                </div>

                {/* <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-500">
                    Last Name
                  </label>
                  <input
                    placeholder="Last name"
                    className="h-10 w-full rounded-md border border-white/5 bg-[#24212a] px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#6d35ff]/60"
                  />
                </div> */}
              </div>

              <button
                disabled={true}
                className="mt-5 h-10 rounded-md disabled:bg-[#6d35ff]/60 bg-[#6d35ff] px-4 text-sm font-semibold text-white transition hover:bg-[#7c4dff]"
              >
                Save Changes
              </button>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-white/5" />

              {/* Danger Zone */}
              <div className="relative rounded-lg border border-red-500/70 px-4 py-4">
                <span className="absolute -top-3 left-3 rounded bg-red-500 px-2 py-1 text-[11px] font-semibold text-white">
                  Danger Zone
                </span>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Delete Account
                    </h2>
                    <p className="mt-3 text-sm text-zinc-500">
                      Delete your account and all of your data in Montra
                    </p>
                    <p className="mt-1 text-sm text-red-400">
                      This action is permanent and irreversible.
                    </p>
                  </div>

                  <button className="h-8 rounded-md bg-[#2a2731] px-4 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white">
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default page;
