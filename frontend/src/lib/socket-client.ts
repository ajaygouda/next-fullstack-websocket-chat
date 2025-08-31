"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000", {
      path: "/api/socket",
      autoConnect: true,
      transports: ["websocket", "polling"], // Add this line
      withCredentials: true,
    });
  }
  return socket;
};