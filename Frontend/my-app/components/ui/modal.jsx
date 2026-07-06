import React from "react";
import { useState } from "react";

function CustomModal({ open, setOpen }) {
  if (open) {
    console.log("modal true");
}else{
      console.log("modal false");

  }

  return (
    <>
      {open && (
        <div
          onClick={() => {
            setOpen(false);
          }}
          className="fixed inset-0 z-50  px-4 "
        >
          <div
            className="bottom-10 left-50  bg-white absolute  h-50 w-50"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p>Modalllllllll</p>

            <p></p>
            <p></p>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomModal;
