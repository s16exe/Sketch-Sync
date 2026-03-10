import React from "react";

const Toolbar = ({ tool, setTool, onSave }) => {
  return (
    <div className="toolbar">
      <button
        className={tool === "pen" ? "active" : ""}
        onClick={() => setTool("pen")}
      >
        Pen
      </button>
      <button
        className={tool === "eraser" ? "active" : ""}
        onClick={() => setTool("eraser")}
      >
        Eraser
      </button>
      <button
        className={tool === "rectangle" ? "active" : ""}
        onClick={() => setTool("rectangle")}
      >
        Rectangle
      </button>
      <button
        className={tool === "circle" ? "active" : ""}
        onClick={() => setTool("circle")}
      >
        Circle
      </button>

      <button className="save-btn" onClick={onSave}>
        Save Board
      </button>
    </div>
  );
};

export default Toolbar;
