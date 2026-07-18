"use client"



import React,{createContext,useState} from "react";


export const ModalContext = createContext();


export function ModalProvider({ children }) {
    const [isOpen,setIsOpen] = useState(false);

    const OpenModal = ()=>{  return setIsOpen(true)  };
    const CloseModal = ()=>{  return setIsOpen(false)    }

  return ( 
     <ModalContext.Provider value={{ isOpen,OpenModal,CloseModal }}>
        { children }
    </ModalContext.Provider>
    )
    
    
}





