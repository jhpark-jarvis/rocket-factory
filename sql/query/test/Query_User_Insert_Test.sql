/*
=============================================
Desc.   :   테스트용 유저 데이터 생성
Example   :   CALL rocket_factory.Query_User_Insert_Test
History   :   2026-05-10   JHPARK 생성
=============================================
*/

INSERT INTO T_User (
    UserId,
    Email,
    PasswordHash,
    Nickname
)
VALUES
(
    'admin',
    'admin@test.com',
    '$2b$12$examplehash_admin',
    '관리자'
),
(
    'user01',
    'user01@test.com',
    '$2b$12$examplehash_user01',
    '유저1'
),
(
    'user02',
    'user02@test.com',
    '$2b$12$examplehash_user02',
    '유저2'
),
(
    'user03',
    'user03@test.com',
    '$2b$12$examplehash_user03',
    '유저3'
);