// auth.service.js를 가져온다.
// 실제 회원가입 로직은 service에서 처리한다.
const authService = require('../services/auth.service');

// 회원가입 요청을 처리하는 controller 함수다.
// Express의 route에서 이 함수를 호출한다.
async function register(req, res) {
  try {
    // 클라이언트가 보낸 JSON body에서 값을 꺼낸다.
    const { username, email, password, passwordConfirm, nickname } = req.body;

    // 필수값이 모두 있는지 검사한다.
    // 하나라도 없으면 400 Bad Request를 반환한다.
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '필수값이 누락되었습니다.',
      });
    }

    // 비밀번호와 비밀번호 확인이 같은지 검사한다.
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      });
    }

    // 비밀번호 길이를 간단히 검사한다.
    // 실제 서비스에서는 더 구체적인 정책을 둘 수 있다.
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      });
    }

    // service에 넘길 회원가입 데이터를 만든다.
    const registerData = {
      // 아이디
      username,

      // 이메일
      email,

      // 원본 비밀번호
      // service에서 해싱한다.
      password,

      // 닉네임
      nickname,
    };

    // 회원가입 service를 호출한다.
    const createdUser = await authService.registerUser(registerData);

    // 회원가입 성공 응답을 반환한다.
    // 새 리소스 생성이므로 201 Created를 사용한다.
    return res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: createdUser,
    });
  } catch (error) {
    // service나 repository에서 발생한 에러를 처리한다.
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다.',
    });
  }
}

// 다른 파일에서 register controller를 사용할 수 있게 내보낸다.
module.exports = {
  register,
};