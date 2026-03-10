import React, { useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import { Client } from "@stomp/stompjs";
import { fetchBoardState } from "../services/api";

const Whiteboard = ({ boardId, tool, elements, setElements }) => {
  const isDrawing = useRef(false);
  const stompClientRef = useRef(null);
  const lastElementRef = useRef(null);
  const clientId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    fetchBoardState(boardId).then((data) => {
      if (data) setElements(data);
    });

    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws-board",

      onConnect: () => {
        stompClient.subscribe(`/topic/board/${boardId}`, (message) => {
          const incoming = JSON.parse(message.body);

          // Ignore our own messages
          if (incoming.clientId === clientId.current) return;

          // Handle clear board
          if (incoming.type === "CLEAR") {
            setElements([]);
            return;
          }

          setElements((prev) => {
            const index = prev.findIndex((el) => el.id === incoming.id);

            if (index !== -1) {
              const updated = [...prev];
              updated[index] = incoming;
              return updated;
            }

            return [...prev, incoming];
          });
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => stompClient.deactivate();
  }, [boardId, setElements]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();

    const id = `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const newElement = {
      id,
      type: tool === "pen" || tool === "eraser" ? "line" : tool,
      tool,
      color: tool === "eraser" ? "#ffffff" : "#df4b26",
      points: [pos.x, pos.y],
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      radius: 0,
      brushSize: tool === "eraser" ? 20 : 5,
      clientId: clientId.current,
    };

    lastElementRef.current = newElement;

    setElements((prev) => [...prev, newElement]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const pos = e.target.getStage().getPointerPosition();

    setElements((prev) => {
      const lastIdx = prev.length - 1;
      if (lastIdx < 0) return prev;

      const updated = [...prev];
      const item = { ...updated[lastIdx] };

      if (item.type === "line") {
        item.points = item.points.concat([pos.x, pos.y]);
      } else if (item.type === "rectangle") {
        item.width = pos.x - item.x;
        item.height = pos.y - item.y;
      } else if (item.type === "circle") {
        item.radius = Math.sqrt(
          Math.pow(pos.x - item.x, 2) + Math.pow(pos.y - item.y, 2),
        );
      }

      updated[lastIdx] = item;

      lastElementRef.current = item;

      return updated;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    const element = lastElementRef.current;

    if (stompClientRef.current?.connected && element) {
      stompClientRef.current.publish({
        destination: `/app/draw/${boardId}`,
        body: JSON.stringify(element),
      });
    }
  };

  const clearBoard = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/draw/${boardId}`,
        body: JSON.stringify({
          type: "CLEAR",
          clientId: clientId.current,
        }),
      });
    }
  };

  return (
    <>
      <button
        onClick={clearBoard}
        style={{
          position: "absolute",
          top: "80px",
          right: "20px",
          zIndex: 100,
        }}
      >
        Clear All
      </button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === "line")
              return (
                <Line
                  key={el.id}
                  points={el.points}
                  stroke={el.color}
                  strokeWidth={el.brushSize}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    el.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              );

            if (el.type === "rectangle")
              return (
                <Rect
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  stroke={el.color}
                  strokeWidth={3}
                />
              );

            if (el.type === "circle")
              return (
                <Circle
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  radius={el.radius}
                  stroke={el.color}
                  strokeWidth={3}
                />
              );

            return null;
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default Whiteboard;
