import express from 'express';
import pool from '../dbConnection.mjs';
import { dbUserQueries } from '../repositories/dbUser.js';
import { hashPassword, verifyPassword } from '../utils/passwordCrypto.js';
const router = express.Router();

/**
 * 예시: 경로 파라미터 + 쿼리스트링 확인
 * GET /api/user/validate/:id?name=foo&page=1
 */
router.get('/user/validate/', async (req, res, next) => {
  // example : /api/user/validate/?email=user@example.com&type=email
  const searchType = req.query.type; // 'email' or 'UserId'
  let conn;
  let searchWord = String.Empty;
  if (searchType == 'email') {
    searchWord = req.query.email;
  }
  else if (searchType == 'UserId') {
    searchWord = req.query.UserId;
  }
  else {
    return res.status(400).json({ error: 'Invalid search type' });
  }

  try {
    // DB connection
    conn = await pool.getConnection();
    let q = String.Empty;

    if (searchType == 'email') {
      q = dbUserQueries.uspUserEmailList;
      q = q.replaceAll('{email}', searchWord);
    }
    else if (searchType == 'UserId') {
      q = dbUserQueries.uspUserIdList;
      q = q.replaceAll('{UserId}', searchWord);
    }
    else {
      return res.status(400).json({ error: 'Invalid search type' });
    }
    const checkDuplicate = await conn.query(q);
    const resultData = checkDuplicate[0];

    let userIdx = null;
    let TypeWord = searchType == 'email' ? '이메일' : '아이디';

    if (resultData && resultData.length > 0) {
      // 데이터가 있을 때
      userIdx = Number(resultData[0].UserIdx);
      console.log(`중복된 ${TypeWord} 발견. UserIdx:`, userIdx);
      res.json({
        isDuplicate: true,
        userIdx: Number(userIdx),
        message: `이미 사용 중인 ${TypeWord}입니다.`,
      });
    } else {
      // 데이터가 없을 때
      console.log(`사용 가능한 ${TypeWord}입니다.`);
      res.json({
        isDuplicate: false,
        userIdx: null,
        message: `사용 가능한 ${TypeWord}입니다.`,
      });
    }

    return;
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

router.post('/user/register/', async (req, res, next) => {
  // TODO : 회원가입 API 구현
  let conn;
  try {
    // 1. 클라이언트로부터 UserId, Email, Password, Nickname을 받아온다.
    const { UserId, Email, Password, Nickname } = req.body;
    console.log(req.body);
    console.log('회원가입 요청 데이터:', { UserId, Email, Password, Nickname });
    // 2. DB에 연결한다.
    conn = await pool.getConnection();
    // 3. USP_User_Insert 프로시저를 호출한다. (파라미터 전달)
    let q = dbUserQueries.uspUserInsert;
    q = q.replaceAll('{UserId}', UserId)
         .replaceAll('{Email}', Email)
         .replaceAll('{Password}', await hashPassword(Password)) // 비밀번호는 해싱해서 전달
         .replaceAll('{Nickname}', Nickname);
    
    const result = await conn.query(q);
    // 4. 프로시저 실행 결과를 확인한다. (성공/실패)
    if (result.affectedRows === 0) {
      // 프로시저가 영향을 준 행이 없으면 실패로 간주
      // 5. 실패한 경우, 에러 메시지를 클라이언트에 반환한다.
      return res.status(400).json({ error: '회원가입에 실패했습니다.' });
    }

    // 6. 성공적으로 회원가입이 완료되면, 성공 메시지를 클라이언트에 반환한다.
    res.json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    // SIGNAL SQLSTATE로부터 받은 에러 메시지 처리
    if (error.text && error.text.includes('이메일 중복')) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }
    if (error.text && error.text.includes('UserId 중복')) {
      return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
    }
    if (error.text && error.text.includes('닉네임 중복')) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }
    
    // 그 외 에러는 다음 미들웨어로 전달
    next(error);
  } finally {
    if (conn) conn.release();
  }

});

router.post('/user/login/', async (req, res, next) => {
  // TODO : 로그인 API 구현
  let conn;
  try {
    const { UserId, Password } = req.body;

    if (!UserId || !Password) {
      return res.status(400).json({ error: 'UserId와 비밀번호를 입력해주세요.' });
    }

    // DB에 연결
    conn = await pool.getConnection();

    // UserId로 사용자 조회
    let q = dbUserQueries.uspUserIdList;
    q = q.replaceAll('{UserId}', UserId);

    const result = await conn.query(q);
    const userData = result[0]; // 프로시저 결과의 첫 번째 배열
    console.log(result);
    console.log(userData);

    if (!userData || userData.length === 0) {
      return res.status(401).json({ error: 'UserId 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = userData[0];

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(Password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'UserId 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 로그인 성공
    res.json({
      message: '로그인 성공',
      user: {
        UserIdx: Number(user.UserIdx),
        UserId: user.UserId,
        Email: user.Email,
        Nickname: user.Nickname
      }
    });

  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
});




export default router;
