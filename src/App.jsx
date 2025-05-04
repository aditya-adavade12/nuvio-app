import React, { useState } from "react";
import ToolBar from "./components/ToolBar";
import DropDown from "./components/DropDown";
import FabricCanvas from "./components/FabricCanvas";

export const App = () => {
  const [tool, setTool] = useState("default");

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <DropDown tool={tool} setTool={setTool} />
      <FabricCanvas tool={tool} />
      <ToolBar tool={tool} setTool={setTool} />
    </div>
  );
};

export default App;
