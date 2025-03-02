// components/ChatApp.tsx
"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://greenalytic-vehicle-monitoring-1.onrender.com"); // Make sure this matches the backend URL

const ChatApp: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on("receiveMessage", (message: string) => {
      console.log("Received from server:", message);
      setReceivedMessage(message);
    });

    // Clean up listener on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send a message to the server
  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage(""); // Reset message input
  };

  return (
    <div>
      <h1>Socket.IO Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send Message</button>

      <h2>Message from server:</h2>
      <p>{receivedMessage}</p>
    </div>
  );
};

export default ChatApp;
