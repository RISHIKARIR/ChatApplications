import Image from "next/image";
import React from "react";

function ImageShowModal({ setOpenImage, openImage,imageDetails,setImageDetails }) {


  if (!openImage) return null;

  console.log(imageDetails[0].url,"diudhudu")

  return (

    <div 
    onClick={()=>{setOpenImage(false)}}
    className="fixed inset-0 z-999 flex items-center justify-center  bg-black/90 ">
    

      <Image quality={90}  width={800} height={900} src={`${imageDetails[0].url}`}
      onClick={(e)=>{
        e.stopPropagation()
      }}
      className="absolute text-center object-contain h-100 w-100 bg-white text-white">
        
        

      </Image>
    
    
    </div>
  );
}

export default ImageShowModal;
