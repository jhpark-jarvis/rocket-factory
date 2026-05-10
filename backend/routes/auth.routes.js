// express를 불러온다.
// Router를 만들기 위해 필요하다.
const express = require('express');

// auth.controller.js를 가져온다.
// 실제 요청 처리는 controller가 담당한다.
const authController = require('../controllers/auth.controller');

// Express Router 인스턴스를 생성한다.
// auth 관련 API를 이 router에 모아둔다.
const router = express.Router();

// POST /register 요청을 register controller에 연결한다.
// index.js에서 /api/auth로 연결하면 최종 URL은 POST /api/auth/register가 된다.
router.post('/register', authController.register);

// index.js에서 사용할 수 있게 router를 내보낸다.
module.exports = router;