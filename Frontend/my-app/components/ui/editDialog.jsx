import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Apifetch } from "../../lib/apifetch";
import { useContext } from "react";
import { SocketContext } from "../../app/context/socketContext";
export function EditDialog({ open, setOpen, editMessage, setEditmessage }) {
  const [message, setMessage] = useState("");

  const { socketRef } = useContext(SocketContext);

  async function editusermessage(e) {
    e.preventDefault();
    if (message.trim() === "") return;
    try {
      if (!socketRef.current) return;

      socketRef.current.emit("edit_message", {
        message: message,
        message_id: editMessage.id,
        conversation_id: editMessage.conversation_id,
      });

      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-[#1f1f1f] text-white border border-white/10">
        <DialogHeader>
          <DialogTitle>Edit message</DialogTitle>
          <DialogDescription>
            This message will be shown as edited message
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={editMessage?.message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="bg-red-500" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-green-600"
            type="submit"
            onClick={editusermessage}
          >
            Edit Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
