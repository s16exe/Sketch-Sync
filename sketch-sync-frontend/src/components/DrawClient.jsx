import { useEffect, useRef } from "react";
import SockJS from "sockjs-client/dist/sockjs"; // <-- patched line
import { CompatClient } from "@stomp/stompjs";

export default function DrawClient({ drawId }) {
  const canvasRef = useRef(null);
  const stompRef = useRef(null);
  const drawing = useRef(false);

  /* ───────────── set-up once ───────────── */
  useEffect(() => {
    /* Canvas dimensions */
    const canvas = canvasRef.current;
    canvas.width = 0.98 * window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    /* SockJS + STOMP client */
    const stomp = new CompatClient();
    stomp.webSocketFactory = () =>
      new SockJS("http://localhost:8080/websocket");
    stomp.onConnect = () => {
      /* incoming messages */
      stomp.subscribe(`/topic/draw/${drawId}`, (frame) => {
        const { type, x, y } = JSON.parse(frame.body);
        if (type === "down") {
          ctx.moveTo(x, y);
        }
        if (type === "draw") {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });
    };
    stomp.activate();
    stompRef.current = stomp;

    /* cleanup */
    return () => stomp.deactivate();
  }, []);

  /* ───────────── mouse handlers ───────────── */
  const send = (type, x, y) =>
    stompRef.current?.publish({
      destination: `/app/draw/${drawId}`,
      body: JSON.stringify({ type, x, y }),
    });

  const onMouseDown = (e) => {
    drawing.current = true;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.moveTo(x, y);
    send("down", x, y);
  };

  const onMouseUp = () => (drawing.current = false);

  const onMouseMove = (e) => {
    if (!drawing.current) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    send("draw", x, y);
  };

  /* ───────────── UI ───────────── */
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #ccc", display: "block" }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    />
  );
}
