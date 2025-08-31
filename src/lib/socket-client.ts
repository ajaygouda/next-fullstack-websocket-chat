// lib/socket-client.ts
"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket",
      autoConnect: true,
      transports: ["websocket", "polling"] // Add this line
    });
  }
  return socket;
};