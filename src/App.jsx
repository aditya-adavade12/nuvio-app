import React, { useState } from "react";
import ToolBar from "./components/ToolBar";
import DropDown from "./components/DropDown";
import CanvasBoard from "./components/Canvas";

export const App = () => {
  const [tool, setTool] = useState("line");
  return (
    <div>
      <DropDown tool={tool} />
      <CanvasBoard tool={tool} />
      <ToolBar tool={tool} setTool={setTool} />
    </div>
  );
};

export default App;
