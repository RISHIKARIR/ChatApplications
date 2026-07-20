    import { useEffect, useRef, useState } from "react";

    export function useImageUpload(initialImage = null){
        const [preview,setPreview] = useState(initialImage);

        const uploadRef = useRef(null);
        
        function previewImage(e){
        const file = e.target?.files[0];

            if(!file)return;

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        }


        function removeImage(){
            setPreview(null);
        }

    
        return {preview,uploadRef,previewImage,removeImage}

    }