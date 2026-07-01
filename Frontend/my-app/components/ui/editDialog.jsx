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

export function EditDialog({ open, setOpen, editMessage, setEditmessage }) {

    async function editusermessage(){




    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        
      <DialogContent className="sm:max-w-md text-white bg-black">
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
              defaultValue={editMessage.message}
             
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="bg-red-500"  type="button">Cancel</Button>
          </DialogClose>
          <Button className="bg-green-600" type="submit">Edit Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
