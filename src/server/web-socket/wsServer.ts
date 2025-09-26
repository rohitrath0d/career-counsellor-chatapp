import { IncomingMessage } from 'http';
import { WebSocketServer } from "ws";
import { applyWSSHandler, CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { appRouter } from "../routers/index"; // your main router
import { createWSSContext } from "../context/wsContext";

const wss = new WebSocketServer({ port: 3001 });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  // createContext: createWSSContext // must be sync
  createContext: (opts: CreateWSSContextFnOptions) => createWSSContext({
    req: opts.req as IncomingMessage & {
      connectionParams?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
    res: opts.res,
  })

});

console.log(" WebSocket Server listening on ws://localhost:3001");

// Keep the Node process alive
wss.on("connection", (socket) => {
  // console.log("Client connected");
  console.log(`Got a connection ${wss.clients.size}`)

  socket.on("close", () => {
    // console.log(" Client disconnected");
    console.log(`Closed connection ${wss.clients.size}`)

  });
});
console.log(`wss server listening on ws://localhost:3001`)


// wss.on("error", (error) => {
//   console.error("WebSocket server error:", error);
// });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down WebSocket server");
  handler.broadcastReconnectNotification();
  wss.close();
});