

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
  onconfirm,
  title,
  message,
  icon,
  confirmMessage
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
            {icon}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handlesubmit}>
            {confirmMessage}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
