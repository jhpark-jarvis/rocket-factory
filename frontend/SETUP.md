# Frontend Setup Guide

## 개요
Rocket Factory의 프론트엔드 서비스입니다. Next.js를 사용하여 구축됩니다.

## 기술 스택
- **Runtime**: Node.js 24 (Alpine Linux)
- **프레임워크**: Next.js 14
- **포트**: 3000
- **빌드**: Multi-stage Docker build
- **실시간**: Socket.io 클라이언트

## 파일 구조
```
frontend/
├── pages/
│   ├── index.js      # 홈페이지 (Socket.io 통합)
│   └── _app.js       # App 컴포넌트
├── styles/
│   ├── globals.css   # 전역 스타일
│   └── Home.module.css # 홈페이지 스타일
├── public/           # 정적 파일
├── next.config.js    # Next.js 설정
├── package.json      # 의존성
├── Dockerfile        # Multi-stage 빌드
├── .dockerignore     # Docker 제외 파일
└── SETUP.md         # 이 파일
```

## 현재 구현 상태

### 완성된 기능
✅ Next.js 14 프로젝트 구조  
✅ Socket.io 클라이언트 통합  
✅ 홈페이지 with Socket 상태 표시  
✅ 반응형 스타일 (모바일/데스크톱)  
✅ SSR/SSG 지원  
✅ 환경 변수 설정  
✅ Multi-stage Docker 빌드 (크기 최적화)  

### 구현할 기능
⬜ 라우팅 확장  
⬜ 상태 관리 (Redux/Zustand)  
⬜ 폼 검증  
⬜ API 통합  
⬜ 인증 시스템  

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 24 이상
- npm 11 이상

### 설치 절차
1. 의존성 설치:
   ```bash
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속하세요.

3. 프로덕션 빌드:
   ```bash
   npm run build
   npm start
   ```

## Docker로 실행

### 단일 컨테이너 실행
```bash
docker build -t rocket-frontend .
docker run -p 3000:3000 rocket-frontend
```

### docker-compose로 실행 (권장)
프로젝트 루트에서:
```bash
docker-compose up frontend
```

## 환경 변수 설정

### 개발 환경 (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost/
```

### 프로덕션 환경 (`.env.production`)
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SOCKET_URL=https://yourdomain.com
```

## 페이지 개발

### 새 페이지 생성
`pages/new-page.js` 파일 생성:
```javascript
export default function NewPage() {
  return <h1>New Page</h1>;
}
```

자동으로 라우트 `/new-page`로 접근 가능합니다.

### API 라우트
`pages/api/route.js` 파일 생성:
```javascript
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' });
}
```

`/api/route`에서 접근 가능합니다.

## Socket.io 사용

### 홈페이지에서 Socket.io 연결
`pages/index.js`에서 이미 구현되어 있습니다:
```javascript
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

socket.on('connect', () => {
  setStatus('연결됨');
});

socket.on('disconnect', () => {
  setStatus('연결 끊김');
});
```

### 다른 페이지에서 Socket.io 사용
```javascript
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

useEffect(() => {
  socket.on('message', (data) => {
    console.log('Message:', data);
  });

  return () => socket.off('message');
}, []);
```

## 스타일링

### CSS Modules
컴포넌트별 스타일:
```javascript
import styles from '../styles/Component.module.css';

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### 전역 스타일
`styles/globals.css`에서 관리합니다.

## 개발 팁

### Hot Reload
개발 서버 실행 중 파일 변경하면 자동 리로드됩니다.

### 로그 확인
```bash
docker-compose logs -f frontend
```

### 컨테이너 접근
```bash
docker exec -it rocket-factory-frontend sh
```

### 빌드 크기 최적화
```bash
npm run build

# 분석
npx next-bundle-analyzer
```

### Next.js 최적화
- Image 컴포넌트 사용으로 이미지 최적화
- Code splitting 자동 지원
- Font 최적화 자동 적용

## 의존성

현재 설치된 패키지:
- `next` - 프레임워크
- `react` - UI 라이브러리
- `react-dom` - React DOM
- `socket.io-client` - Socket.io 클라이언트
- `eslint-config-next` (dev) - 린트 설정

## 생산성 팁

### npm 스크립트
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 실행
npm run lint     # 코드 린트
```

### 디버깅
```javascript
console.log('Debug:', variable);
// 브라우저 DevTools (F12)에서 확인
```

### 성능 확인
```bash
npm run build
# .next 폴더의 파일 크기 확인
```

## 배포

### Vercel 배포 (권장)
```bash
npm i -g vercel
vercel
```

### Docker 배포
이미 Dockerfile이 설정되어 있습니다:
```bash
docker build -t rocket-frontend:latest .
docker run -p 3000:3000 rocket-frontend:latest
```

## 트러블슈팅

### 포트 3000 이미 사용 중
```bash
npm run dev -- -p 3001
```

### Socket.io 연결 실패
- Backend 서버 실행 확인
- `NEXT_PUBLIC_SOCKET_URL` 확인
- 브라우저 콘솔의 에러 메시지 확인

### 빌드 실패
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```
