import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pool from './test.mjs';
import { dbTestQueries } from './queries/dbTest.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Rocket Factory Backend!' });
});

app.get('/api/db-test', async (req, res, next) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const [connection] = await conn.query(dbTestQueries.connection);
    const [userCount] = await conn.query(dbTestQueries.userCount);
    const [postCount] = await conn.query(dbTestQueries.postCount);
    const posts = await conn.query(dbTestQueries.posts);

    const normalizedPosts = posts.map((post) => ({
      ...post,
      PostIdx: Number(post.PostIdx),
      ViewCount: Number(post.ViewCount),
    }));

    res.json({
      connected: true,
      database: connection.db,
      serverTime: connection.now,
      counts: {
        users: Number(userCount.count),
        posts: Number(postCount.count),
      },
      posts: normalizedPosts,
    });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', (data) => {
    console.log(`Message from ${socket.id}:`, data);
    io.emit('message', { from: socket.id, data });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Rocket Factory Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
