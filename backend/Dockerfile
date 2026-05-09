# Backend Dockerfile - Node.js + Express + Socket.io
FROM node:24-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 환경 설정
ENV NODE_ENV=production

# 호스트의 package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["node", "index.js"]
