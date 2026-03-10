import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import Whiteboard from "./components/Whiteboard";
import { saveBoardState } from "./services/api";
import "./App.css";

function App() {
  const [tool, setTool] = useState("pen");
  const [elements, setElements] = useState([]); // Renamed from 'lines'
  const boardId = "main-room-1";

  const handleSave = () => {
    saveBoardState(boardId, elements);
  };

  return (
    <div className="app-container">
      <Toolbar tool={tool} setTool={setTool} onSave={handleSave} />
      <Whiteboard
        boardId={boardId}
        tool={tool}
        elements={elements}
        setElements={setElements}
      />
    </div>
  );
}

export default App;
