import React from "react";

export const ToolBar = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-8">
    <div id="tool-bar" className="w-fit flex flex-row gap-3 px-4 py-3 rounded-lg bg-stone-900 shadow-md">
      {[
        { icon: "arrow_selector_tool", label: "Cursor" },
        { icon: "pan_tool", label: "Free Draw" },
        { icon: "rectangle", label: "Rectangle" },
        { icon: "change_history", label: "Triangle" },
        { icon: "circle", label: "Circle" },
        { icon: "horizontal_rule", label: "Line" },
        { icon: "trending_flat", label: "Arrow" },
      ].map((tool, index) => (
        <button
          key={index}
          className="text-sm rounded-lg p-1 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition"
          title={tool.label}
        >
          <span className="material-symbols-outlined text-sm opacity-75">{tool.icon}</span>
        </button>
      ))}
    </div>
  </div>
  
  );
};

export default ToolBar;
