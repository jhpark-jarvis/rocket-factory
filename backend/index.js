import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pool from './test.mjs';
//import sql from '../sql/query';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
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
    const [connection] = await conn.query('SELECT 1 AS ok, DATABASE() AS db, NOW() AS now');
    const [userCount] = await conn.query('SELECT COUNT(*) AS count FROM T_User');
    const [postCount] = await conn.query('SELECT COUNT(*) AS count FROM T_Post');
    const posts = await conn.query(`
      SELECT    TP.PostIdx,
                TP.Title,
                TP.Content,
                TP.ViewCount,
                TP.RegDT,
                TU.UserName,
                TU.Nickname
      FROM      T_Post AS TP
      LEFT JOIN T_User AS TU ON TU.UserIdx = TP.UserIdx
      ORDER BY  TP.PostIdx DESC
      LIMIT 10
    `);

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

app.get('/db-test', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rocket Factory DB Test</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f7f8fb;
        color: #1f2937;
      }
      main {
        width: min(960px, calc(100% - 32px));
        margin: 40px auto;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 32px;
      }
      .status, table {
        margin-top: 24px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
      }
      .status {
        padding: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
      }
      th, td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
        vertical-align: top;
      }
      th {
        background: #eef2f7;
        font-size: 14px;
      }
      .error {
        color: #b91c1c;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Rocket Factory DB Test</h1>
      <p>MariaDB 연결과 게시글 데이터 조회 결과입니다.</p>
      <section id="status" class="status">로딩 중...</section>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>작성자</th>
            <th>제목</th>
            <th>조회수</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody id="posts"></tbody>
      </table>
    </main>
    <script>
      const statusEl = document.querySelector('#status');
      const postsEl = document.querySelector('#posts');

      fetch('/api/db-test')
        .then((response) => response.json())
        .then((data) => {
          if (!data.connected) throw new Error('DB 연결 실패');

          statusEl.innerHTML =
            '<strong>연결 성공</strong><br />' +
            'Database: ' + data.database + '<br />' +
            'Users: ' + data.counts.users + ' / Posts: ' + data.counts.posts + '<br />' +
            'Server time: ' + data.serverTime;

          postsEl.innerHTML = data.posts.map((post) => (
            '<tr>' +
              '<td>' + post.PostIdx + '</td>' +
              '<td>' + (post.Nickname || post.UserName || '-') + '</td>' +
              '<td>' + post.Title + '</td>' +
              '<td>' + post.ViewCount + '</td>' +
              '<td>' + post.RegDT + '</td>' +
            '</tr>'
          )).join('');
        })
        .catch((error) => {
          statusEl.className = 'status error';
          statusEl.textContent = '테스트 실패: ' + error.message;
        });
    </script>
  </body>
</html>`);
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
  console.log(`🚀 Rocket Factory Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
