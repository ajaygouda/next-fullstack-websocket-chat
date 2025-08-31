import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - crucial for production
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store user-socket mappings (same as before)
const userSocketMap = new Map<string, string>();

// Socket.IO logic (same as before)
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('register', (userId: string) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

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
    console.log('❌ User disconnected:', socket.id);
    
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

// Health check endpoint (important for deployment)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});