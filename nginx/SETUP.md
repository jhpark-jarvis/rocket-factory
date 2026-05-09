# Nginx 리버스 프록시 Setup Guide

## 개요
Rocket Factory의 Nginx 리버스 프록시입니다. Frontend, Backend, Socket.io 트래픽을 라우팅합니다.

## 기술 스택
- **베이스 이미지**: Nginx Alpine
- **포트**: 80
- **용도**: 리버스 프록시, 로드 밸런싱, SSL 종료

## 파일 구조
```
nginx/
├── Dockerfile       # Nginx 이미지 정의
├── nginx.conf       # 리버스 프록시 설정
└── SETUP.md        # 이 파일
```

## 현재 구현 상태

### 완성된 기능
✅ Frontend 라우팅 (`/` → :3000)  
✅ Backend API 라우팅 (`/api/` → :3001)  
✅ Socket.io 라우팅 (`/socket.io` → :3001)  
✅ WebSocket 업그레이드  
✅ Gzip 압축  
✅ 프록시 헤더 설정  
✅ Multi-worker 설정  

### 구현할 기능
⬜ SSL/TLS (HTTPS)  
⬜ 로드 밸런싱  
⬜ 캐싱 정책  
⬜ 레이트 리미팅  
⬜ 모니터링  

## 라우팅 규칙

### 경로별 라우팅
| 경로 | 대상 | 설명 |
|------|------|------|
| `/` | Frontend (3000) | 메인 프론트엔드 |
| `/api/` | Backend (3001) | API 엔드포인트 |
| `/socket.io` | Backend (3001) | Socket.io 연결 |

## nginx.conf 상세 설명

### Upstream 정의
```nginx
upstream frontend {
    server frontend:3000;  # Docker 네트워크 내 호스트명
}

upstream backend {
    server backend:3001;
}
```

### Server 블록
```nginx
server {
    listen 80;
    server_name _;  # 모든 호스트명 허용
```

### Frontend 라우팅
```nginx
location / {
    proxy_pass http://frontend;
    # HTTP/1.1로 업그레이드 (Keep-alive)
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

### Backend API 라우팅
```nginx
location /api/ {
    proxy_pass http://backend/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

### Socket.io 라우팅 (WebSocket)
```nginx
location /socket.io {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    # WebSocket 업그레이드
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
}
```

## 로컬 개발 환경 설정

### Nginx 설정 파일 수정
`nginx.conf`에서 upstream 서버 주소를 로컬 환경에 맞게 수정하세요:

```conf
upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:3001;
}
```

### 로컬에서 실행 (macOS)
```bash
# Nginx 설치
brew install nginx

# 설정 파일 검증
nginx -t -c $(pwd)/nginx.conf

# Nginx 실행
nginx -c $(pwd)/nginx.conf

# Nginx 재시작
nginx -s reload

# Nginx 중지
nginx -s stop
```

### 로컬에서 실행 (Linux)
```bash
# Nginx 설치
sudo apt-get install nginx

# 설정 파일 복사
sudo cp nginx.conf /etc/nginx/sites-available/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## Docker로 실행

### 단일 컨테이너 실행
```bash
docker build -t rocket-nginx .
docker run -p 80:80 rocket-nginx
```

### docker-compose로 실행 (권장)
프로젝트 루트에서:
```bash
docker-compose up nginx
```

## 특징

### Socket.io 지원
- WebSocket 업그레이드 헤더 설정
- 버퍼링 비활성화 (`proxy_buffering off`)
- 실시간 통신 지원

### 보안 기능
- `X-Forwarded-Proto` - 원본 프로토콜 정보
- `X-Real-IP` - 클라이언트 실제 IP
- `X-Forwarded-For` - 요청 경로 추적

### 성능 최적화
- Gzip 압축 활성화 (텍스트, JSON, JavaScript)
- Vary 헤더 설정 (캐시 변형 감지)
- 적절한 워커 프로세스 자동 설정

## SSL/TLS 설정 (프로덕션)

### Let's Encrypt 인증서 추가
```bash
# Certbot으로 인증서 생성
certbot certonly --webroot -w /var/www -d yourdomain.com

# Nginx 설정에 추가
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}

# HTTP → HTTPS 리다이렉트
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 모니터링

### Nginx 프로세스 확인
```bash
ps aux | grep nginx
```

### 설정 문법 검사
```bash
docker-compose exec nginx nginx -t
# 또는
nginx -t
```

### 로그 확인
```bash
# 컨테이너 로그
docker-compose logs -f nginx

# 호스트 로그 (Linux)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 액세스 통계
```bash
# 최근 100개 요청
tail -100 /var/log/nginx/access.log

# IP별 요청 분석
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 상태 코드 분석
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c
```

## 로드 밸런싱 설정

### 다중 백엔드 서버
```nginx
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
    
    # 가중치 설정
    # server backend1:3001 weight=3;
    # server backend2:3001 weight=1;
}
```

## 캐싱 설정

### 정적 파일 캐싱
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    proxy_cache_valid 200 30d;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
}
```

## 트러블슈팅

### 502 Bad Gateway
**원인**: Backend/Frontend 서버가 실행 중이 아님
```bash
# 서비스 상태 확인
docker-compose ps

# 서비스 로그 확인
docker-compose logs backend
docker-compose logs frontend
```

### 타임아웃
```nginx
# 프록시 타임아웃 증가
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

### Socket.io 연결 실패
**확인 사항**:
1. `/socket.io` 경로 라우팅 설정 확인
2. WebSocket 업그레이드 헤더 설정 확인
3. 방화벽 포트 개방 확인

```bash
# 연결 테스트
curl -i http://localhost/socket.io
```

### Nginx 설정 오류
```bash
# 설정 문법 검사
docker-compose exec nginx nginx -t

# 상세 에러 메시지
docker-compose logs nginx
```

## 개발 vs 프로덕션 설정

### 개발 (HTTP만 사용)
- 현재 설정 그대로 사용
- HTTP 포트 80만 필요

### 프로덕션 (HTTPS 필수)
- SSL/TLS 설정 추가
- HTTP → HTTPS 리다이렉트
- HSTS 헤더 설정
- CSP (Content Security Policy) 추가
- 보안 헤더 추가 (X-Frame-Options, X-Content-Type-Options 등)
