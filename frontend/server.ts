import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Store user-socket mappings
const userSocketMap = new Map<string, string>();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(server, {
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    // Handle user registration (associate user ID with socket)
    socket.on('register', (userId: string) => {
      userSocketMap.set(userId, socket.id);
    });

    // Handle private messages
    socket.on('private_message', (data: any) => {
      const { senderId, receiverId, message, createdAt, seen } = data;
      
      // Find the recipient's socket ID
      const recipientSocketId = userSocketMap.get(receiverId);
      
      if (recipientSocketId) {
        // Send to the specific recipient using io.to()
        io.to(recipientSocketId).emit('private_message', {
          message,
          senderId,
          receiverId,
          createdAt,
          seen
        });
        console.log(`Message sent to ${receiverId} (socket: ${recipientSocketId})`);
      } else {
        console.log(`Recipient ${receiverId} not connected`);
      }

      // Also send back to sender for UI update
      socket.emit('private_message', {
        message,
        senderId,
        receiverId,
        createdAt,
        seen
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
      
      // Remove user from mapping on disconnect
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} removed from mapping`);
          break;
        }
      }
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});