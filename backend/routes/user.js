import express from 'express';
import pool from '../dbConnection.mjs';
import { dbUserQueries } from '../repositories/dbUser.js';

const router = express.Router();

/**
 * 예시: 경로 파라미터 + 쿼리스트링 확인
 * GET /api/user/example/:id?name=foo&page=1
 */
router.get('/user/example/:id', async (req, res, next) => {
  // example : /api/user/example/123?email=user@example.com
  const searchEmail = req.query.email;

  // DB connection
  let conn;

  try {
    conn = await pool.getConnection();
    
    let q = dbUserQueries.uspUserEmailList;
    // (dbUserQueries.uspUserEmailList)
    // q : 'CALL rocket_factory.USP_User_List(2, NULL, "{}")'

    q = q.replaceAll('{email}', searchEmail);
    // (dbUserQueries.uspUserEmailList).format(searchEmail);
    // q : 'CALL rocket_factory.USP_User_List(2, NULL, "user@example.com")'
    const checkEmailDuplicate = await conn.query(q);
    
    // 데이터 존재 여부 확인 및 UserIdx 추출
    const resultData = checkEmailDuplicate[0]; // 쿼리 결과의 첫 번째 배열
    let userIdx = null;

    if (resultData && resultData.length > 0) {
      // 데이터가 있을 때
      userIdx = resultData[0].UserIdx;
      console.log('중복된 이메일 발견. UserIdx:', userIdx);
      res.json({
        isDuplicate: true,
        userIdx: Number(userIdx),
        message: '이미 사용 중인 이메일입니다.',
      });
    } else {
      // 데이터가 없을 때
      console.log('사용 가능한 이메일입니다.');
      res.json({
        isDuplicate: false,
        userIdx: null,
        message: '사용 가능한 이메일입니다.',
      });
    }

    return;
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }

});

export default router;
