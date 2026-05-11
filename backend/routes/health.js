import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Hello from Rocket Factory Backend!' });
});

export default router;
