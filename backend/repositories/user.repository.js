
const pool = require('../db/pool');


// email으로 회원을 조회하는 함수다.
// 회원가입 시 아이디 중복 확인에 사용한다.
async function findByUsername(username) {
    // users 테이블에서 email이 일치하는 회원 1명을 조회한다.
    // ?는 SQL Injection을 막기 위한 파라미터 바인딩 자리다.
    const rows = await pool.query(
      'SELECT id, username, email, password_hash, nickname, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [username]
    );
  
    // 조회 결과가 있으면 첫 번째 회원을 반환한다.
    // 없으면 undefined가 반환된다.
    return rows[0];
  }

// email으로 회원을 조회하는 함수다.
// 회원가입 시 아이디 중복 확인에 사용한다.
async function findByEmail(email) {
  // users 테이블에서 email이 일치하는 회원 1명을 조회한다.
  // ?는 SQL Injection을 막기 위한 파라미터 바인딩 자리다.
  const rows = await pool.query(
    'SELECT id, username, email, password_hash, nickname, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  // 조회 결과가 있으면 첫 번째 회원을 반환한다.
  // 없으면 undefined가 반환된다.
  return rows[0];
}


// 신규 회원을 생성하는 함수다.
// service에서 검증과 비밀번호 암호화가 끝난 뒤 호출된다.
async function createUser(userData) {
  // service에서 넘겨준 회원가입 데이터를 구조분해한다.
  const { username, email, passwordHash, nickname } = userData;

  // users 테이블에 신규 회원 데이터를 INSERT한다.
  const result = await pool.query(
    `
    INSERT INTO users (
      username,
      email,
      password_hash,
      nickname,
//      created_at,
//      updated_at
    ) VALUES (?, ?, ?)
    `,
    [username, email, passwordHash, nickname]
  );

  // INSERT 결과를 반환한다.
  // MariaDB에서는 insertId 등이 들어올 수 있다.
  return result;
}

// 다른 파일에서 사용할 수 있도록 함수들을 내보낸다.
module.exports = {
  findByEmail,
  findByUsername,
  createUser,
};