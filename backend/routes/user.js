import express from 'express';

const router = express.Router();

/**
 * 예시: 경로 파라미터 + 쿼리스트링 확인
 * GET /api/user/example/:id?name=foo&page=1
 */
router.get('/user/example/:id', (req, res) => {
  console.log('[user/example] req.params:', req.params);
  console.log('[user/example] req.query:', req.query);
  console.log('email:', req.query.email);
  res.json({
    message: '예시 응답 — 콘솔에서 params/query 확인',
    params: req.params,
    query: req.query,
  });
});

export default router;
