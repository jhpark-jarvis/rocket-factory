DROP PROCEDURE IF EXISTS rocket_factory.USP_User_Insert;

/*
=============================================
Desc.   :   USP 사용자 정보 삽입
Example :   CALL rocket_factory.USP_User_Insert('user01', 'user01@example.com', '$2b$12$examplehash_user01', 'user01');
History :   2026-05-11   PJWOO 생성
            2026-05-11   JHPARK Collate 오류 해결, Collate utf8mb4_unicode_ci 관련 설정 제거
=============================================
*/
DELIMITER $$

CREATE PROCEDURE rocket_factory.USP_User_Insert
(
    IN p_UserName VARCHAR(30),
    IN p_Email VARCHAR(255),
    IN p_PasswordHash VARCHAR(255),
    IN p_Nickname VARCHAR(50)
)
BEGIN

    DECLARE v_EmailExists BIT DEFAULT 0;
    DECLARE v_UserNameExists BIT DEFAULT 0;

    -- 이메일 중복 확인
    SET v_EmailExists = (
        SELECT EXISTS(
            SELECT 1
            FROM rocket_factory.T_User
            WHERE Email
        )
    );

    -- UserName 중복 확인
    SET v_UserNameExists = (
        SELECT EXISTS(
            SELECT 1
            FROM rocket_factory.T_User
            WHERE UserName
        )
    );

    IF v_EmailExists = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '이메일 중복';
    END IF;

    IF v_UserNameExists = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'UserName 중복';
    END IF;

    INSERT INTO rocket_factory.T_User (
        UserName,
        Nickname,
        Email,
        PasswordHash
    )
    VALUES (
        p_UserName,
        p_Nickname,
        p_Email,
        p_PasswordHash
    );

END$$

DELIMITER ;