import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SocketContext } from "../../app/context/socketContext";
import { useContext } from "react";

export function AlertDialogDestructive({
  open,
  setOpen,
  deletedMessage,
  onconfirm,
}) {
  const handlesubmit = async () => {
    try {
      await onconfirm();
    } catch (err) {
      console.log(err);
    }finally{
      setOpen(false)
    }
  };






  return (
    <AlertDialog open={open} onOpenChange={setOpen} className="bg-black">
      <AlertDialogContent
        size="sm"
        className="bg-[#1f1f1f] text-white border border-white/10"
      >
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/20 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Message?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            This will permanently delete this Message from this conversation for
            Everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handlesubmit}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
