/*
=============================================
Desc.   :   USP 게시글 리스트 조회
Example   :   CALL [USP_Post_List]
History   :   2026-05-10   JHPARK 생성
=============================================
*/
DELIMITER $$

CREATE PROCEDURE USP_Post_List
(
    IN p_offset INT,
    IN p_limit INT
)
BEGIN

    SELECT
        P.PostIdx,
        P.Title,
        P.ViewCount,
        P.RegDT,
        U.UserName,
        U.Nickname
    FROM T_Post P
    INNER JOIN T_User U
        ON P.UserIdx = U.UserIdx
    WHERE P.DelDT IS NULL
    ORDER BY P.RegDT DESC
    LIMIT p_offset, p_limit;

END$$

DELIMITER ;