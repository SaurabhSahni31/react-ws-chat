import React, { useEffect, useState } from "react";
import DisplayConversation from "./DisplayConversation";
import MessagingBox from "./MessagingBox";

function MessagingPanel({ userName }) {
  const [message, setMessage] = useState([]);
  console.log("message", userName, message);

  const socket = new WebSocket("ws://localhost:5000/");

  useEffect(() => {
    socket.onmessage = (event) => {
      setMessage((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      socket.close();
    };
  }, [message]);

  const getMessage = (message) => {
    const data = { userName: userName, message: message };
    console.log("data", data)
    socket.send(JSON.stringify(data));
  };
  return (
    <div className="messagingPanel">
      <DisplayConversation />
      <MessagingBox setMessage={setMessage} />
    </div>
  );
}

export default MessagingPanel;
