import express from 'express';
import pool from '../dbConnection.mjs';
import { dbUserQueries } from '../repositories/dbUser.js';

const router = express.Router();

/**
 * 예시: 경로 파라미터 + 쿼리스트링 확인
 * GET /api/user/example/:id?name=foo&page=1
 */
router.get('/user/example/:id', async (req, res, next) => {
  // example : /api/user/example/123?email=user@example.com&type=email
  const searchType = req.query.type; // 'email' or 'username'
  // searchType이라는 변수를 설정한다. 이 안에는 이메일인지, 아이디인 지를 구분하는 인자가 들어갈 거임.   -- 20260514 PJWoo
  // 
  let conn;
  let searchWord = null;
  if (searchType === 'email') {
    searchWord = req.query.email;
  }
  else if (searchType === 'username') {
    searchWord = req.query.username;
  }
  else {
    return res.status(400).json({ error: 'Invalid search type' });
  }
  // searchType이 'email'일 때와 'username'일 때로 분기됨.        -- 20260514 PJWoo
  // if문과 else문 req.query.[]안을 searchType 값에 따라 바꿔주었음.        -- 20260514 PJWoo

  // DB connection
  // TODO : 여기부터 분기 로직 작성 필요함

  try {
    conn = await pool.getConnection();
    
    if (searchType === 'email'){
      // if문으로 searchType이 이메일 일 때의 분기를, let q 변수 선언과  q안의 파라미터를 대체하는 로직을 넣어준다.        -- 20260514 PJWoo

    let q = dbUserQueries.uspUserEmailList;
    // (dbUserQueries.uspUserEmailList)
    // q : 'CALL rocket_factory.USP_User_List(2, NULL, "{}")'

    q = q.replaceAll('{email}', searchWord);
    // (dbUserQueries.uspUserEmailList).format(searchWord);
    // q : 'CALL rocket_factory.USP_User_List(2, NULL, "user@example.com")'
  } //if문이 끝나는 구간        -- 20260514 PJWoo
  else if(searchType === 'username'){
    let q = dbUserQueries.uspUserNameList;
    // (dbUserQueries.uspUserNameList)
    // q : 'CALL rocket_factory.USP_User_List(1, "{}", NULL)'
    q = q.replaceAll('{username}', searchWord);
    // (dbUserQueries.uspUserEmailList).format(searchWord);
    // q : 'CALL rocket_factory.USP_User_List(2, NULL, "user@example.com")'
  } //else if문이 끝나는 구간        -- 20260514 PJWoo 
  else {
    return res.status(400).json({ error: 'Invalid search type' });
  }//else 문이 끝나는 구간        -- 20260514 PJWoo
    const checkEmailDuplicate = await conn.query(q);
    

    
    // 데이터 존재 여부 확인 및 UserIdx 추출
    const resultData = checkEmailDuplicate[0]; // 쿼리 결과의 첫 번째 배열
    let userIdx = null;

    if (resultData && resultData.length > 0) {
      // 데이터가 있을 때
      userIdx = Number(resultData[0].UserIdx);
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
