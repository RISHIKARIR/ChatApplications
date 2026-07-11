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
import { useRef, useState } from "react";

export default function Dropdown({ open, config }) {
  const uploadref = useRef(null);
  const [preview, setPreview] = useState(null);

  const previewFile = (e) => {
    console.log("chlaaaa");

    const file = e.target.files[0];
    console.log(file, "foifoi");

    setPreview(URL.createObjectURL(file));
  };

  console.log(preview, "previewww");

  return (
    <>
      <input
        ref={uploadref}
        type="file"
        className="hidden"
        onChange={previewFile}
      />

      {preview != null ? 
      

      
      <div className="absolute left-95 bottom-20 overflow-hidden bg-black h-15 z-999 w-100">
            <button  onClick={ (e)=>{e.stopPropagation()
                  setPreview(null) }} className="bg-white h-10">btn</button>


      </div> 
      
      
      : ""
      
      
      }

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
