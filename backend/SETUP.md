# Backend Setup Guide

## 개요
Rocket Factory의 백엔드 서비스입니다. Node.js + Express + Socket.io를 사용합니다.

## 기술 스택
- **Runtime**: Node.js 24 (Alpine Linux)
- **프레임워크**: Express.js
- **실시간 통신**: Socket.io
- **데이터베이스**: MariaDB
- **포트**: 3001

## 파일 구조
```
backend/
├── index.js           # Express + Socket.io 메인 서버
├── package.json       # 의존성 정의
├── Dockerfile         # Docker 이미지
├── .dockerignore      # Docker 제외 파일
└── SETUP.md          # 이 파일
```

## 현재 구현 상태

### 완성된 기능
✅ Express 기본 서버  
✅ Socket.io 통합 (CORS 설정)  
✅ `/api/health` - 헬스 체크  
✅ `/api/test` - 테스트 엔드포인트  
✅ Socket 이벤트 핸들러 (message, disconnect)  
✅ 에러 처리 미들웨어  

### 구현할 기능
⬜ 데이터베이스 연결  
⬜ 인증/인가 시스템  
⬜ API 엔드포인트 확장  
⬜ 요청 검증  
⬜ 로깅 시스템  

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 24 이상
- npm 11 이상
- MariaDB 또는 MySQL

### 설치 절차
1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정 (`.env` 파일 생성):
   ```
   NODE_ENV=development
   PORT=3001
   DATABASE_HOST=localhost
   DATABASE_USER=rocketuser
   DATABASE_PASSWORD=rocketpassword
   DATABASE_NAME=rocket_factory
   DATABASE_PORT=3306
   FRONTEND_URL=http://localhost:3000
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

## Docker로 실행

### 단일 컨테이너 실행
```bash
docker build -t rocket-backend .
docker run -p 3001:3001 -e DATABASE_HOST=host.docker.internal rocket-backend
```

### docker-compose로 실행 (권장)
프로젝트 루트에서:
```bash
docker-compose up backend
```

## API 엔드포인트

### 현재 구현된 엔드포인트

#### 헬스 체크
```http
GET /api/health
```
응답:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

#### 테스트 엔드포인트
```http
GET /api/test
```
응답:
```json
{
  "message": "Hello from Rocket Factory Backend!"
}
```

## Socket.io 이벤트

### 클라이언트 → 서버
```javascript
socket.emit('message', { text: 'Hello' });
```

### 서버 → 클라이언트
```javascript
socket.on('message', (data) => {
  console.log('Received:', data);
});
```

### 연결/해제
```javascript
socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
```

## 개발 팁

### Hot reload 활성화
```bash
npm install --save-dev nodemon
npm run dev
```

### 로그 확인
```bash
docker-compose logs -f backend
```

### 컨테이너 디버깅
```bash
docker exec -it rocket-factory-backend sh
```

### npm 패키지 추가
```bash
# 호스트에서
npm install package-name

# Docker에서
docker-compose exec backend npm install package-name
# 그 후 rebuild
docker-compose build backend --no-cache
```

## 데이터베이스 연결

### MariaDB 연결 코드 예시
```javascript
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});

// 연결 테스트
const connection = await pool.getConnection();
const res = await connection.query('SELECT 1');
connection.end();
```

## 의존성

현재 설치된 패키지:
- `express` - 웹 프레임워크
- `socket.io` - 실시간 통신
- `cors` - CORS 미들웨어
- `mariadb` - 데이터베이스 드라이버
- `dotenv` - 환경 변수 관리
- `nodemon` (dev) - 자동 재시작

## 트러블슈팅

### 포트 이미 사용 중
```bash
# 다른 포트로 실행
PORT=3002 npm run dev
```

### 데이터베이스 연결 실패
- MariaDB 실행 확인: `docker-compose ps`
- 연결 정보 확인: `.env` 파일 검증
- 로그 확인: `docker-compose logs mariadb`

### Socket.io 연결 실패
- CORS 설정 확인
- 방화벽 포트 확인
- 네트워크 대기시간 확인