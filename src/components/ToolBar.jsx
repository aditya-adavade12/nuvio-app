import React from "react";

const tools = [
  { icon: "arrow_selector_tool", label: "Free Draw", value: "freedraw" },
  { icon: "pan_tool", label: "Cursor", value: "hand" },
  { icon: "rectangle", label: "Rectangle", value: "rectangle" },
  { icon: "change_history", label: "Triangle", value: "triangle" },
  { icon: "circle", label: "Circle", value: "circle" },
  { icon: "horizontal_rule", label: "Line", value: "line" },
  { icon: "trending_flat", label: "Arrow", value: "arrow" },
];

const ToolBar = ({ tool, setTool }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-8 z-50">
      <div className="w-fit flex flex-row gap-3 px-4 py-3 rounded-lg bg-stone-900 shadow-md">
        {tools.map((t, index) => (
          <button
            key={index}
            onClick={() => setTool(t.value)}
            className={`text-sm rounded-lg p-1 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition ${
              tool === t.value ? "bg-stone-700" : ""
            }`}
            title={t.label}
          >
            <span className="material-symbols-outlined text-sm opacity-75">
              {t.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
