import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu-sidebar";
import { SquarePen, Trash2,Trash2Icon,EllipsisVertical } from "lucide-react";
import { EditDialog } from "../../../components/ui/editDialog";
import { AlertDialogDestructive } from "../../../components/ui/deleteDialog";
import { useState } from "react";
import { SocketContext } from "../../context/socketContext";

function Messages({
  showChats,
  bottomRef,
  user,
  handleImageModal,
  conversationData,
  editUserMessage,
  deleteUserMessage,
}) {
  
  const [open, setOpen] = useState(false);
  const [editMessage, setEditmessage] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletedMessage, setDeletedMessage] = useState(null);


  const { socketRef } = useContext(SocketContext)




  function editUserMessage(item) {
    setOpen(true);
    setEditmessage(item);
  }

    function deleteUserMessage(item) {
    setDeleteOpen(true);
    setDeletedMessage(item);
  }


    async function deleteMessage() {
      const socket = socketRef.current;
  
      if (!socket) return;
  
      socket.emit("delete_message", {
        deletedMessage,
      });
    }
  

  return (
    <div>
      


      <ul className="space-y-9">
        {showChats &&
          showChats?.data?.map((item) => {
            return (
              <li
                ref={bottomRef}
                key={item.id}
                className={`flex ${
                  user.id === item.senderId ? "justify-end" : "justify-start"
                }`}
              >
                {user.id === item.senderId ? (
                  <div className="flex max-w-[70%] items-start gap-3">
                    <div className="order-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d8d0b8] text-xs font-black uppercase text-black ring-1 ring-white/10">
                      {user?.name?.charAt(0) || "U"}
                    </div>

                    <div className="order-1">
                      <p className="mb-1 text-right text-[10px] font-bold uppercase text-white/90">
                        YOU{" "}
                        <span className="ml-1 text-zinc-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>

                      <div className="rounded-md bg-[#d9ded2] px-4 py-3 text-black shadow-md shadow-black/20">
                        {item.isDeleted ? (
                          "Message Deleted"
                        ) : (
                          <p className="flex items-center overflow-hidden gap-2 text-[12px] font-semibold leading-relaxed text-black">
                            {item.message.trim() == "" &&
                            item.media.length > 0 ? (
                              <>
                                {item.message.trim() === "" &&
                                  item.media.length >= 2 && (
                                    <>
                                      <div
                                        onClick={() => {
                                          handleImageModal(item.media);
                                        }}
                                        className="flex gap-2"
                                      >
                                        {item.media.slice(0, 1).map((image) => (
                                          <img
                                            key={image.id}
                                            src={image.url}
                                            className="h-20 w-20"
                                            alt=""
                                          />
                                        ))}

                                        <div className="h-20 w-20 rounded-md bg-blue-200 flex items-center justify-center">
                                          +{item.media.length - 1} photos
                                        </div>
                                      </div>
                                    </>
                                  )}
                              </>
                            ) : (
                              ""
                            )}

                            {item.message}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <EllipsisVertical
                                  size={15}
                                  className="opacity-50"
                                  variant="ghost"
                                />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="border border-white/10 bg-[#111111] text-white">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      editUserMessage(item);
                                    }}
                                    className="focus:bg-white/10 focus:text-white"
                                  >
                                    <SquarePen /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      deleteUserMessage(item);
                                    }}
                                    className="text-red-500 focus:bg-red-500 focus:text-white"
                                  >
                                    <Trash2 /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </p>
                        )}

                        <p className="mt-2 text-right text-[9px] font-semibold text-zinc-600">
                          <span>
                            {item.isSeen
                              ? "seen "
                              : item.isDelivered
                                ? "Delivered "
                                : "Sent "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex max-w-[70%] items-start gap-3">
                    {conversationData.Profile_img ? (
                      <img
                        src={conversationData?.Profile_img}
                        className="flex h-10 rounded-full  w-10 items-center justify-center text-xl font-bold text-zinc-500"
                      ></img>
                    ) : (
                      <div className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8d0b8] text-xs font-black uppercase text-black ring-1 ring-white/10 sm:flex">
                        {conversationData.chatName.charAt(0)}
                      </div>
                    )}

                    <div>
                      {conversationData?.isGroup && (
                        <p className="mb-1 text-[10px] font-bold uppercase text-white">
                          {item?.sender?.name}
                        </p>
                      )}

                      <div className="rounded-md bg-[#e7e5d8] px-4 py-3 text-black shadow-md shadow-black/20">
                        {item.isDeleted ? (
                          "Message Deleted"
                        ) : (
                          <>
                            <p className="text-[12px] flex gap-2 font-semibold leading-relaxed text-black">
                              {item.message.trim() === "" &&
                                item.media.length >= 2 && (
                                  <>
                                    {item.media.slice(0, 1).map((image) => (
                                      <img
                                        key={image.id}
                                        src={image.url}
                                        className="h-20 w-20"
                                        alt=""
                                      />
                                    ))}

                                    <div className="h-20 w-20 rounded-md bg-blue-200 flex items-center justify-center">
                                      +{item.media.length - 1} photos
                                    </div>
                                  </>
                                )}

                              {item.message}
                            </p>

                            <p className="mt-2 text-left text-[9px] font-semibold text-zinc-600">
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

        <EditDialog
          open={open}
          setOpen={setOpen}
          editMessage={editMessage}
          setEditmessage={setEditmessage}
        />

        <AlertDialogDestructive
          open={deleteOpen}
          setOpen={setDeleteOpen}
          deletedMessage={deletedMessage}
          onconfirm={deleteMessage}
          title={"Delete Message?"}
          message={
            "This will permanently delete this Message from this conversation for Everyone."
          }
          icon={<Trash2Icon />}
          confirmMessage={"Delete"}
        />
      </ul>
    </div>
  );
}

export default Messages;
