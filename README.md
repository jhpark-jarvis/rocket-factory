# Rocket Factory

현대적인 실시간 웹 애플리케이션 프레임워크입니다.

## 프로젝트 구조

```
rocket-factory/
├── backend/
│   ├── Dockerfile              # Backend 이미지 정의
│   ├── index.js                # Express + Socket.io 서버
│   ├── package.json            # 의존성 정의
│   ├── .dockerignore           # Docker 제외 파일
│   └── SETUP.md                # Backend 개발 가이드
│
├── frontend/
│   ├── Dockerfile              # Multi-stage 빌드 설정
│   ├── next.config.js          # Next.js 설정
│   ├── package.json            # 의존성 정의
│   ├── .dockerignore           # Docker 제외 파일
│   ├── SETUP.md                # Frontend 개발 가이드
│   ├── pages/
│   │   ├── index.js            # 홈페이지 (Socket.io 통합)
│   │   └── _app.js             # App 래퍼
│   ├── styles/
│   │   ├── globals.css         # 전역 스타일
│   │   └── Home.module.css     # 홈페이지 스타일
│   └── public/                 # 정적 파일
│
├── nginx/
│   ├── Dockerfile              # Nginx 이미지 정의
│   ├── nginx.conf              # Nginx 리버스 프록시 설정
│   └── SETUP.md                # Nginx 설정 가이드
│
├── docker-compose.yml          # 전체 서비스 오케스트레이션
├── package.json                # 루트 메타데이터
├── README.md                   # 이 파일
└── .env                        # 환경 변수 (git 무시)
```

## 파일별 주요 설정

### Backend (Express + Socket.io)
**backend/index.js**
- HTTP/Socket.io 서버 기반 구성
- CORS 활성화
- `/api/health` - 헬스 체크 엔드포인트
- `/api/test` - 테스트 엔드포인트
- Socket 이벤트: `message`, `disconnect`

**backend/package.json**
- express: 웹 프레임워크
- socket.io: 실시간 통신
- mariadb: 데이터베이스 드라이버
- cors: CORS 미들웨어
- dotenv: 환경 변수 관리

### Frontend (Next.js 14)
**frontend/pages/index.js**
- Socket.io 클라이언트 통합
- 실시간 연결 상태 표시
- 반응형 UI

**frontend/next.config.js**
- 환경 변수 설정
- `NEXT_PUBLIC_API_URL` - 백엔드 API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.io 서버 URL

**frontend/styles/**
- Home.module.css - 홈페이지 스타일 (그라데이션 배경)
- globals.css - 전역 스타일

### Nginx (Reverse Proxy)
**nginx/nginx.conf**
- `/` → Frontend (3000)
- `/api/` → Backend (3001)
- `/socket.io` → Backend (3001) with WebSocket upgrade
- Gzip 압축 활성화
- 로드 밸런싱 준비

### Docker Compose
**docker-compose.yml**
- 서비스 정의: mariadb, backend, frontend, nginx
- 헬스 체크: MariaDB 시작 대기
- 네트워크: rocket-network 격리
- 볼륨: mariadb_data 영속성

## 빠른 시작

### 필수 요구사항
- Docker 20.10+
- Docker Compose 2.0+

### 전체 스택 실행

```bash
# 모든 서비스 시작
docker-compose up -d

# 서비스 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 현재 구현 상태 ✅

#### Backend 서비스
- ✅ Express.js 서버 구성 (포트 3001)
- ✅ Socket.io 실시간 통신 지원
- ✅ CORS 설정
- ✅ 기본 API 엔드포인트
  - `GET /api/health` - 헬스 체크
  - `GET /api/test` - 테스트 엔드포인트
- ✅ Socket 이벤트 핸들러
  - `message` - 메시지 수신
  - `disconnect` - 연결 해제

#### Frontend 서비스
- ✅ Next.js 14 프로젝트 구성
- ✅ Socket.io 클라이언트 통합
- ✅ 기본 페이지 구조 (`pages/index.js`, `pages/_app.js`)
- ✅ 스타일링 (`styles/globals.css`, `styles/Home.module.css`)
- ✅ Next.js 설정 (`next.config.js`)
- ✅ SSR, SSG, Static 페이지 생성 지원

#### Database
- ✅ MariaDB 12.2.2 실행 중
- ✅ 데이터베이스 `rocket_factory` 자동 생성
- ✅ 응용 프로그램 사용자 설정 (rocketuser)

#### Nginx
- ✅ 리버스 프록시 설정
- ✅ Frontend 라우팅 (`/` → localhost:3000)
- ✅ Backend API 라우팅 (`/api/` → localhost:3001)
- ✅ Socket.io 라우팅 (`/socket.io` → localhost:3001)
- ✅ Gzip 압축 활성화
- ✅ WebSocket 업그레이드 헤더 설정

### 개별 서비스 실행

```bash
# Backend만 시작
docker-compose up -d backend

# Frontend만 시작
docker-compose up -d frontend

# Nginx만 시작
docker-compose up -d nginx
```

## 로컬 개발

각 서비스의 로컬 개발 가이드를 확인하세요:

- **Backend**: [backend/SETUP.md](backend/SETUP.md)
- **Frontend**: [frontend/SETUP.md](frontend/SETUP.md)
- **Nginx**: [nginx/SETUP.md](nginx/SETUP.md)

## 서비스 테스트

### Backend API 테스트
```bash
# 헬스 체크
curl http://localhost:3001/api/health

# 테스트 엔드포인트
curl http://localhost:3001/api/test
```

### Frontend 확인
- 브라우저: http://localhost:3000
- Nginx 프록시: http://localhost
- Socket.io 연결 상태 확인 가능

### Socket.io 연결 확인
Frontend 페이지를 열면 Socket.io 연결 상태가 표시됩니다.

### Database 확인
```bash
# MariaDB 접속
docker-compose exec mariadb mariadb -u rocketuser -p rocket_factory
# 비밀번호: rocketpassword

# 테이블 확인
SHOW TABLES;
```

## 접속 경로

| 서비스 | URL | 설명 |
|--------|-----|------|
| Nginx 프록시 | http://localhost | 메인 진입점 |
| Frontend | http://localhost:3000 | 개발 서버 |
| Backend | http://localhost:3001 | API 서버 |
| MariaDB | localhost:3306 | 데이터베이스 |

## 환경 변수

### Backend
- `NODE_ENV`: 환경 (production/development)
- `DATABASE_HOST`: 데이터베이스 호스트
- `DATABASE_USER`: 데이터베이스 사용자
- `DATABASE_PASSWORD`: 데이터베이스 비밀번호
- `DATABASE_NAME`: 데이터베이스 이름

### Frontend
- `NEXT_PUBLIC_API_URL`: 백엔드 API URL
- `NEXT_PUBLIC_SOCKET_URL`: Socket.io 서버 URL

### MariaDB
- `MYSQL_ROOT_PASSWORD`: root 계정 비밀번호
- `MYSQL_DATABASE`: 기본 데이터베이스 이름
- `MYSQL_USER`: 응용 프로그램 사용자
- `MYSQL_PASSWORD`: 응용 프로그램 사용자 비밀번호

## Docker Compose 명령어

```bash
# 서비스 시작 (백그라운드)
docker-compose up -d

# 빌드 후 시작
docker-compose up -d --build

# 로그 확인
docker-compose logs -f [service_name]

# 서비스 재시작
docker-compose restart [service_name]

# 서비스 중지
docker-compose stop [service_name]

# 모든 서비스 중지 및 정리
docker-compose down

# 볼륨 포함 정리
docker-compose down -v

# 특정 서비스만 빌드
docker-compose build [service_name]
```

## 트러블슈팅

### 포트 충돌
이미 사용 중인 포트가 있으면 `docker-compose.yml`에서 포트를 수정하세요.

### 컨테이너가 시작되지 않음
```bash
docker-compose logs [service_name]
```

### 데이터베이스 연결 오류
- MariaDB가 완전히 시작될 때까지 기다리세요
- `docker-compose ps`로 상태를 확인하세요
- 연결 문자열이 올바른지 확인하세요

### 소켓 연결 실패
- Nginx 라우팅 설정 확인
- Backend 서버 실행 확인
- 브라우저 콘솔의 에러 메시지 확인

## 프로덕션 배포

### SSL/TLS 설정
Nginx 설정 파일에서 SSL 인증서를 추가하세요.

### 환경 변수 보안
- `.env` 파일 생성 및 `.gitignore`에 추가
- 프로덕션 비밀번호로 업데이트

### 로그 관리
Docker 로깅 드라이버 설정으로 로그 관리

### 백업
```bash
# 데이터베이스 백업
docker-compose exec mariadb mysqldump -u rocketuser -p rocket_factory > backup.sql
```

## 개발 가이드

### Backend API 추가하기
`backend/index.js`에 새로운 라우트 추가:
```javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

### Frontend 페이지 추가하기
`frontend/pages/` 디렉토리에 새 파일 생성:
```javascript
// pages/about.js
export default function About() {
  return <h1>About Page</h1>;
}
```

### Socket.io 이벤트 추가하기

**Backend** (`backend/index.js`):
```javascript
socket.on('custom-event', (data) => {
  console.log('Received:', data);
  io.emit('response', { message: 'Hello' });
});
```

**Frontend** (`frontend/pages/index.js`):
```javascript
socket.emit('custom-event', { message: 'Hello' });
socket.on('response', (data) => {
  console.log('Response:', data);
});
```

### Database 마이그레이션
`backend/index.js`에 시작 시 마이그레이션 추가:
```javascript
import mariadb from 'mariadb';

const connection = await mariadb.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// 테이블 생성 예시
await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
  )
`);
```

## 체크리스트

설정 완료 항목:
- ✅ Docker Compose 설정
- ✅ Backend Express 서버
- ✅ Frontend Next.js 앱
- ✅ Nginx 리버스 프록시
- ✅ MariaDB 데이터베이스
- ✅ Socket.io 실시간 통신
- ✅ CORS 설정
- ✅ 헬스 체크 엔드포인트

다음 단계:
- ⬜ 데이터베이스 테이블 설계
- ⬜ API 엔드포인트 확장
- ⬜ 사용자 인증 시스템
- ⬜ 에러 처리 및 로깅
- ⬜ 테스트 코드 작성
- ⬜ CI/CD 파이프라인
- ⬜ 프로덕션 배포

## 라이선스
ISC

## 관련 리소스
- [Docker 공식 문서](https://docs.docker.com)
- [Next.js 문서](https://nextjs.org/docs)
- [Express.js 문서](https://expressjs.com)
- [Socket.io 문서](https://socket.io/docs/)
- [MariaDB 문서](https://mariadb.org/documentation/)