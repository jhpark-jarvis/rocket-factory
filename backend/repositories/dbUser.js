export const dbUserQueries = {

    qUserCount: 'SELECT COUNT(*) AS count FROM T_User',
    // USP_User_List @p_Mode --# 1: UserId 검색, 2: Email 검색
    uspUserEmailList: `CALL rocket_factory.USP_User_List(2, NULL, '{email}')`,
    uspUserIdList : `CALL rocket_factory.USP_User_List(1, '{UserId}', NULL)`,
    uspUserInsert : `CALL rocket_factory.USP_User_Insert('{UserId}', '{Email}', '{Password}', '{Nickname}')`,
  };