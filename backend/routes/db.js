import express from 'express';
import pool from '../dbConnection.mjs';
import { dbTestQueries } from '../repositories/dbTest.js';

const router = express.Router();

router.get('/db-test', async (req, res, next) => {
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

export default router;
