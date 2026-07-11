import { Image } from 'lucide-react';
import { FilePlusCorner } from 'lucide-react';
import { SquarePlay } from 'lucide-react'



export const uploadConfig = [  
    {
        name : "Photo",
        icon : <Image/>,
        type : "input"

    },
    {
        name : "Document",
        icon : <FilePlusCorner/>,
        type : "input"
    },
    {
        name : "Video",
        icon : <SquarePlay/>,
        type : "input"
    }

]