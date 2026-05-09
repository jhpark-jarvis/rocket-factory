# Frontend Dockerfile - Next.js
FROM node:24-alpine AS builder

WORKDIR /app

# 빌드 시간 환경 변수 설정
ENV NODE_ENV=production

# package.json 및 의존성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# Production 이미지
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# 빌드 이미지에서 필요한 파일만 복사
COPY package*.json ./
RUN npm install --only=production

# 빌드된 Next.js 앱 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# 포트 노출
EXPOSE 3000

# Next.js 시작
CMD ["npm", "start"]
