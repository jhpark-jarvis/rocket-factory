// bcrypt 패키지를 불러온다.
// 비밀번호를 평문 그대로 DB에 저장하면 안 되므로 해싱에 사용한다.
const bcrypt = require('bcrypt');

// user.repository.js를 가져온다.
// 실제 DB 조회/저장은 repository가 담당한다.
const userRepository = require('../repositories/user.repository');

// 비밀번호 해싱 강도를 정한다.
// 숫자가 높을수록 보안은 강해지지만 처리 시간이 늘어난다.
const SALT_ROUNDS = 10;

// 회원가입 처리 함수다.
// controller에서 요청 데이터를 정리한 뒤 이 함수를 호출한다.
async function registerUser(registerData) {
  // controller에서 넘겨준 데이터를 구조분해한다.
  const { username, email, password, nickname } = registerData;

  // username이 이미 존재하는지 DB에서 조회한다.
  const existingUsername = await userRepository.findByUsername(username);

  // 이미 같은 username이 있으면 회원가입을 막는다.
  if (existingUsername) {
    // 에러 객체를 만든다.
    const error = new Error('이미 사용 중인 아이디입니다.');

    // controller에서 HTTP status code로 사용할 값을 넣는다.
    error.statusCode = 409;

    // 에러를 던져서 controller의 catch로 넘긴다.
    throw error;
  }

  const existingEmail = await userRepository.findByEmail(email);

  // 이미 같은 email이 있으면 회원가입을 막는다.
  if (existingEmail) {
    // 에러 객체를 만든다.
    const error = new Error('이미 사용 중인 이메일입니다.');

    // controller에서 HTTP status code로 사용할 값을 넣는다.
    error.statusCode = 409;

    // 에러를 던져서 controller의 catch로 넘긴다.
    throw error;
  }


  // 사용자가 입력한 비밀번호를 bcrypt로 해싱한다.
  // DB에는 password가 아니라 passwordHash를 저장해야 한다.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // repository에 넘길 회원 생성 데이터를 만든다.
  const userData = {

    // 아이디
    username,

    // 이메일
    email,

    // 해싱된 비밀번호
    passwordHash,

    // 닉네임
    nickname,
  };

  // DB에 회원 데이터를 INSERT한다.
  const result = await userRepository.createUser(userData);

  // controller에 반환할 결과를 만든다.
  return {
    // INSERT된 회원 id다.
    // 실제 result 구조는 mariadb 버전에 따라 확인 필요하다.
    id: result.insertId,

    // 응답에 보여줄 아이디이다.
    username,

    // 응답에 보여줄 email이다.
    email,

    // 응답에 보여줄 nickname이다.
    nickname,
  };
}

// 다른 파일에서 registerUser를 사용할 수 있게 내보낸다.
module.exports = {
  registerUser,
};