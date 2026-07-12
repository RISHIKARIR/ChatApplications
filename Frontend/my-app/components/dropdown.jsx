import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { Spinner } from "../components/ui/spinner"

export default function Dropdown({
  open,
  config,
  selectedConversation,
  setFiles,
  uploading,
  openfile
}) {
  const uploadref = useRef(null);
  const [preview, setPreview] = useState([]);
  

  useEffect(() => {
    if(openfile == false){

      setPreview([]);
    }
    
  }, [selectedConversation,openfile]);


  console.log(openfile,"opennnnn")
  console.log(selectedConversation, "selecteddd");

  const previewFile = (e) => {
    console.log("chlaaaa");

    const FileList = e.target.files;
    console.log(FileList, "foifoi");

    for (const file in FileList) {
      console.log(FileList[file], "dssddsfdsds");

      const previewFile = URL.createObjectURL(FileList[file]);

      setPreview((prev) => {
        return [...prev, previewFile];
      });

      setFiles((prev) => {
        return [...prev, FileList[file]];
      });
    }

  };

  console.log(preview, "previejeien");

  console.log(preview, "previewww");

  return (
    <>
      <input
        ref={uploadref}
        type="file"
        multiple
        className="hidden"
        onChange={previewFile}
      />

      {preview?.length > 0 && (
        <div className="absolute bottom-20 left-100 z-999 w-fit rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-700">
              {preview.length} file{preview.length > 1 ? "s" : ""} selected   { uploading && <Spinner/> }
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview([]);
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
            >
              Clear
            </button>
          </div>

          <div className="flex max-h-[90px] gap-2 pb-1">
            {preview.map((item, index) => (
              <div
                key={index}
                className="relative h-[70px] w-[80px] shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <img
                  src={item}
                  alt={`preview-${index}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black"
                >
                  ×
                </button>
              </div>
            ))}

            <div
              onClick={() => {
                uploadref.current.click();
              }}
              className="h-17.5 w-20 font-bold flex items-center hover:cursor-pointer gap-1 shrink-0 overflow-hidden text-xs rounded-lg border border-gray-200 bg-gray-100"
            >
              Add more <CirclePlus size={15} />
            </div>
          </div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button />}>{open}</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#1f1f1f]">
          {config.map((item) => {
            return (
              <DropdownMenuGroup
                onClick={() => {
                  uploadref.current.click();
                }}
                className="flex items-center hover:bg-white
            hover:text-black
            text-white bg-[#1f1f1f]"
              >
                <DropdownMenuItem className="hover:bg-white">
                  {item.icon}
                </DropdownMenuItem>
                <DropdownMenuItem>{item.name}</DropdownMenuItem>
              </DropdownMenuGroup>
            );
          })}

          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
