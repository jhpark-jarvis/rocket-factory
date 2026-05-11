DROP PROCEDURE IF EXISTS rocket_factory.USP_Post_Update;

/*
=============================================
Desc.   :   USP 게시글 수정
Example   :   CALL rocket_factory.USP_Post_Update(0, 1, NULL, '수정된 내용', NULL, 1) -- 게시글 수정
            CALL rocket_factory.USP_Post_Update(1, 1, NULL, NULL, NULL, NULL) -- 게시글 삭제
            CALL rocket_factory.USP_Post_Update(2, 1, NULL, NULL, NULL, NULL) -- 게시글 조회수 증가
            CALL rocket_factory.USP_Post_Update(3, 1, NULL, NULL, NULL, NULL) -- 게시글 복구
            CALL rocket_factory.USP_Post_Update(4, 1, NULL, NULL, 1, NULL) -- 게시글 상태 변경
History   :   2026-05-11   JHPARK 생성
=============================================
*/
DELIMITER $$

CREATE PROCEDURE rocket_factory.USP_Post_Update
(
    IN p_Mode       INT,
    IN p_PostIdx    INT,
    IN p_Title      VARCHAR(255),
    IN p_Content    TEXT,
    IN p_Status     TINYINT,
    IN p_IsEdited   BIT
)
BEGIN

    -- 오류 발생 시 ROLLBACK
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    IF p_Mode = 0 THEN

        UPDATE  rocket_factory.T_Post
        SET     Title = COALESCE(p_Title, Title),
                Content = COALESCE(p_Content, Content),
                IsEdited = COALESCE(p_IsEdited, IsEdited),
                UpdateDT = NOW()
        WHERE   PostIdx = p_PostIdx
        AND     DelDT IS NULL;

    ELSEIF p_Mode = 1 THEN

        UPDATE  rocket_factory.T_Post
        SET     DelDT = NOW()
        WHERE   PostIdx = p_PostIdx
        AND     DelDT IS NULL;

    ELSEIF p_Mode = 2 THEN

        UPDATE  rocket_factory.T_Post
        SET     ViewCount = ViewCount + 1
        WHERE   PostIdx = p_PostIdx
        AND     DelDT IS NULL;

    ELSEIF p_Mode = 3 THEN

        UPDATE  rocket_factory.T_Post
        SET     DelDT = NULL
        WHERE   PostIdx = p_PostIdx
        AND     DelDT IS NOT NULL;

    ELSEIF p_Mode = 4 THEN

        UPDATE  rocket_factory.T_Post
        SET     Status = COALESCE(p_Status, Status),
                UpdateDT = NOW()
        WHERE   PostIdx = p_PostIdx
        AND     DelDT IS NULL;

    END IF;

    COMMIT;

END$$

DELIMITER ;