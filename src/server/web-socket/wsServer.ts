import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "../routers/index"; // your main router
// import { createContext } from "../context/context";
import { createWSSContext } from "../context/wsContext";

const wss = new WebSocketServer({ port: 3001 });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWSSContext // must be sync
});

console.log(" WebSocket Server listening on ws://localhost:3001");

// Keep the Node process alive
wss.on("connection", (socket) => {
  console.log("Client connected");

  wss.on("close", () => {
    console.log(" Client disconnected");
  });


});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});


process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down WebSocket server");
  handler.broadcastReconnectNotification();
  wss.close();
});