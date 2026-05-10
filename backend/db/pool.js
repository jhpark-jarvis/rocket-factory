require('dotenv').config();

const mariadb = require('mariadb');


const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST,

  // MariaDB 포트다.
  // 환경변수는 문자열로 들어오므로 Number로 숫자 변환한다.
  port: Number(process.env.DATABASE_PORT),

  // MariaDB 접속 계정이다.
  // 예: rocketuser
  user: process.env.DATABASE_USER,

  // MariaDB 접속 비밀번호다.
  password: process.env.DATABASE_PASSWORD,

  // 사용할 데이터베이스 이름이다.
  // 예: rocket_factory
  database: process.env.DATABASE_NAME,

  // 동시에 유지할 최대 DB 연결 개수다.
  // 처음에는 5~10 정도면 충분하다.
  connectionLimit: 10,
});

// 다른 파일에서 pool.query() 또는 pool.getConnection()을 사용할 수 있게 내보낸다.
module.exports = pool;