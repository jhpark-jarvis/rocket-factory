/*
=============================================
Desc.   :   테스트용 게시글 데이터 생성
Example   :   CALL [Query_Post_Insert_Test]
History   :   2026-05-10   JHPARK 생성
=============================================
*/

INSERT INTO T_Post (
    UserIdx,
    Title,
    Content,
    ViewCount
)
VALUES
(
    1,
    '첫 번째 게시글입니다',
    '관리자가 작성한 첫 번째 게시글 내용입니다.',
    15
),
(
    2,
    'Node.js 질문 있습니다',
    'Socket.IO 사용 시 Redis Adapter가 꼭 필요한가요?',
    7
),
(
    3,
    'Docker Compose 설정 공유',
    'Next.js + MariaDB + Nginx 조합으로 구성했습니다.',
    23
),
(
    2,
    'Prisma 마이그레이션 오류',
    'migrate dev 실행 시 shadow database 관련 오류가 발생합니다.',
    3
),
(
    4,
    '오늘 점심 추천 받습니다',
    '서울에서 혼밥하기 좋은 곳 추천해주세요.',
    11
);