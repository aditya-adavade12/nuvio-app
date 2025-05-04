import React from "react";

const ToolBar = ({ tool, setTool }) => {

  const oneTimeTools = ["rectangle", "triangle", "circle", "square", "line", "arrow"];

  const handleToolClick = (selectedTool) => {
    setTool(selectedTool);

    if (oneTimeTools.includes(selectedTool)) {
      setTimeout(() => setTool("default"), 0); 
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-8 z-50">
      <div className="w-fit flex flex-row gap-3 px-4 py-3 rounded-lg bg-stone-900 shadow-md">

        <button
          onClick={() => setTool("default")}
          className={`text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition ${
            tool === "default" ? "bg-stone-700" : ""
          }`}
          title="Free Draw"
          aria-label="Select Free Draw"
        >
          <span className="material-symbols-outlined text-sm opacity-75">
            arrow_selector_tool
          </span>
        </button>

        {/* Pan tool */}

        <button
          onClick={() => setTool("hand")}
          className={`text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition ${
            tool === "hand" ? "bg-stone-700" : ""
          }`}
          title="Cursor"
          aria-label="Select Cursor"
        >
          <span className="material-symbols-outlined text-sm opacity-75">
            pan_tool
          </span>
        </button>

        <button
          onClick={() => setTool("drawing")}
          className={`text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition ${
            tool === "drawing" ? "bg-stone-700" : ""
          }`}
          title="Drawing"
          aria-label="Select Cursor"
        >
          <span className="material-symbols-outlined text-sm opacity-75">
            draw
          </span>
        </button>

        {/* One-time shape tools */}
        <button onClick={() => handleToolClick("rectangle")} title="Rectangle" aria-label="Select Rectangle"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">rectangle</span>
        </button>

        <button onClick={() => handleToolClick("triangle")} title="Triangle" aria-label="Select Triangle"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">change_history</span>
        </button>

        <button onClick={() => handleToolClick("circle")} title="Circle" aria-label="Select Circle"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">circle</span>
        </button>

        <button onClick={() => handleToolClick("square")} title="Square" aria-label="Select Square"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">square</span>
        </button>

        <button onClick={() => handleToolClick("line")} title="Line" aria-label="Select Line"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">horizontal_rule</span>
        </button>

        <button onClick={() => handleToolClick("arrow")} title="Arrow" aria-label="Select Arrow"
          className="text-sm rounded-lg p-2 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition">
          <span className="material-symbols-outlined text-sm opacity-75">trending_flat</span>
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
