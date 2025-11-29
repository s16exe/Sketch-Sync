import React, { useEffect, useRef, useState } from "react";
import * as Stomp from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs"; // <-- patched line

function ChatClient({ chatId }) {
  const clientRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.Stomp.over(socket);
    clientRef.current = stompClient;
    stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(msg));

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
        console.log("Received:", message.body);
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = { message: message };
    clientRef.current.send(`/app/chat/${chatId}`, {}, JSON.stringify(msg));
  };

  return (
    <div>
      <textarea
        name="text-msg"
        id="text-msg"
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default ChatClient;
