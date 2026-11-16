require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Socket.io Real-Time Chat
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });
    
    socket.on('chatMessage', ({ room, username, message }) => {
        console.log(`[${room}] ${username}: ${message}`);
        io.to(room).emit('message', { username, message });
    });
    
    socket.on('disconnect', () => {
        // Handle disconnect if needed
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
