import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dbConnect from "@/lib/mongodb";
import { Message } from "@/models/Message";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  await dbConnect();
  console.log("✅ MongoDB connected");

  const httpServer = createServer(handler);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join_room", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("fetch_messages", async ({ senderId, receiverId }) => {
      try {
        const messages = await Message.find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        }).sort({ createdAt: 1 });
        socket.emit("chat_history", messages);
      } catch (err) {
        console.error(err);
        socket.emit("error", "Failed to fetch messages");
      }
    });

    socket.on("send_message", async ({ senderId, receiverId, message, createdAt, seen }) => {
      try {
        const newMessage = await Message.create({ senderId, receiverId, message, createdAt, seen });
        const roomId = [senderId, receiverId].sort().join("_");
        io.to(roomId).emit("receive_message", newMessage);
      } catch (err) {
        console.error(err);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("disconnect", () => console.log("❌ Disconnected:", socket.id));
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
