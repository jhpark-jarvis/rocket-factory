DROP PROCEDURE IF EXISTS rocket_factory.USP_User_List;

/*
=============================================
Desc.   :   USP 사용자 정보/리스트 조회
Example :   CALL rocket_factory.USP_User_List(0, NULL, NULL) -- 전체 조회
            CALL rocket_factory.USP_User_List(1, 'user01', NULL) -- UserName 조회
            CALL rocket_factory.USP_User_List(2, NULL, 'user01@example.com') -- Email 조회
History :   2026-05-10   JHPARK 생성
            2026-05-11   JHPARK Collate 오류 해결, Collate utf8mb4_unicode_ci 관련 설정 제거
=============================================
*/

DELIMITER $$

CREATE PROCEDURE rocket_factory.USP_User_List
(
    IN p_Mode INT,                  --# 0: 전체 조회, 1: UserName 조회, 2: Email 조회
    IN p_UserName VARCHAR(255),
    IN p_Email VARCHAR(255)
)
BEGIN

    /*
        UserName 조회
    */
    IF p_Mode = 1 THEN

        SELECT      UserIdx
        FROM        rocket_factory.T_User
        WHERE       DelDT IS NULL
        AND         p_UserName IS NOT NULL
        AND         UserName = p_UserName;

    /*
        Email 조회
    */
    ELSEIF p_Mode = 2 THEN

        SELECT      UserIdx
        FROM        rocket_factory.T_User
        WHERE       DelDT IS NULL
        AND         p_Email IS NOT NULL
        AND         Email = p_Email;

    /*
        전체 조회
    */
    ELSE

        SELECT      *
        FROM        rocket_factory.T_User
        WHERE       DelDT IS NULL
        ORDER BY    RegDT DESC
        LIMIT       100;

    END IF;

END$$

DELIMITER ;