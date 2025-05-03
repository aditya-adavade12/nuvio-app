import React, { useState } from "react";

export const DropDown = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex text-stone-300 border border-stone-700 hover:bg-stone-900 cursor-pointer p-1.5 rounded-lg absolute left-5 top-5 z-10"
        onClick={() => setShow((prev) => !prev)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      {show && (
        <div className="absolute left-5 top-16 bg-stone-900 w-44 px-2.5 py-2.5 rounded-lg shadow-lg z-0">
          <div className="flex flex-col gap-1.5 text-sm text-stone-300">
            <button className="flex flex-row items-center gap-2 hover:bg-stone-800 w-full py-1.5 cursor-pointer rounded-lg px-0.5">
              <span class="material-symbols-outlined">undo</span>
              Undo
            </button>
            <button className="flex flex-row items-center gap-2 hover:bg-stone-800 w-full py-1.5 cursor-pointer rounded-lg px-0.5">
              <span class="material-symbols-outlined">redo</span>
              Redo
            </button>
            <button className="flex flex-row items-center gap-2 hover:bg-stone-800 w-full py-1.5 cursor-pointer rounded-lg px-1.5">
              <span class="material-symbols-outlined">photo_library</span>
              Export as PNG
            </button>
            <button className="flex flex-row items-center gap-2 hover:bg-stone-800 w-full py-1.5 cursor-pointer rounded-lg px-1.5">
              <span class="material-symbols-outlined">refresh</span>
              Reset Canvas
            </button>
            <button
              className="flex flex-row items-center gap-2 hover:bg-stone-800 w-full py-1.5 cursor-pointer rounded-lg px-1.5"
              onClick={() => setShow((prev) => !prev)}
            >
              <span class="material-symbols-outlined">close</span>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
