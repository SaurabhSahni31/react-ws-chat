const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients and message history
const clients = new Set();

wss.on("connection", (ws) => {
  // Send the initial list of connected users to the new client
  const connectedUsernames = Array.from(clients).map(
    (client) => client.username
  );
  ws.send(JSON.stringify({ type: "connectedUsers", data: connectedUsernames }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "login") {
        // Set the username for the client
        ws.username = data.username;

        // Broadcast the updated list of connected users to all clients
        const connectedUsernames = Array.from(clients).map(
          (client) => client.username
        );
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "connectedUsers",
                data: connectedUsernames,
              })
            );
          }
        });
      } else if (data.type === "message") {
        // Broadcast the message to all clients except the sender
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "message", data }));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing JSON:", message);
    }
  });


  ws.on("close", () => {
    // Remove the client from the set when it disconnects
    clients.delete(ws);

    // Broadcast the updated list of connected users to all clients
    const connectedUsernames = Array.from(clients).map(
      (client) => client.username
    );
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "connectedUsers", data: connectedUsernames })
        );
      }
    });
  });

  // Add the new client to the set
  clients.add(ws);
});

server.listen(3001, () => {
  console.log("WebSocket server listening on http://localhost:3001");
});
