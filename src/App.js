import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      const socket = new WebSocket("ws://localhost:3001");

      socket.onopen = () => {
        console.log("WebSocket connected");

        // Send the login message to the server
        socket.send(JSON.stringify({ type: "login", username: userName }));

        // Request the initial list of connected users when connecting
        socket.send(JSON.stringify({ type: "getConnectedUsers" }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "message" && typeof data.data === "string") {
            // New message
            setReceivedMessages((prevMessages) => [...prevMessages, data.data]);
          } else if (
            data.type === "connectedUsers" &&
            Array.isArray(data.data)
          ) {
            // Connected users (including the current user)
            setConnectedUsers(data.data);
          }
        } catch (error) {
          console.error("Error parsing JSON:", event.data);
        }
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [loggedIn, userName]);

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUserName(user);
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && message.trim() !== "") {
      const newMessage = `${userName}: ${message}`;

      // Send the message to the server
      ws.send(JSON.stringify({ type: "message", data: newMessage }));

      setMessage(""); 
    }
  };

  const handleKeyPress = (e) => {
    // Check if the Enter key was pressed (key code 13)
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="App">
      <div className="user-display">
        {loggedIn && (
          <p>
            Active Users:
            <div>
              {connectedUsers.map((name, index) => (
                <p key={index}>{name}</p>
              ))}
            </div>
          </p>
        )}
      </div>
      {!loggedIn ? (
        <Login
          userName={userName}
          setUserName={setUserName}
          handleLogin={handleLogin}
        />
      ) : (
        <div>
          <div>
            <h2>Chat Room:</h2>
            <div className="chat-room">
              {receivedMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          </div>
          <input
            className="textBox"
            type="text"
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="sendMesg" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
