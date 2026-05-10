export const dbTestQueries = {
  connection: 'SELECT 1 AS ok, DATABASE() AS db, NOW() AS now',
  userCount: 'SELECT COUNT(*) AS count FROM T_User',
  postCount: 'SELECT COUNT(*) AS count FROM T_Post',
  posts: `
    SELECT    TP.PostIdx,
              TP.Title,
              TP.Content,
              TP.ViewCount,
              TP.RegDT,
              TU.UserName,
              TU.Nickname
    FROM      T_Post AS TP
    LEFT JOIN T_User AS TU ON TU.UserIdx = TP.UserIdx
    ORDER BY  TP.PostIdx DESC
    LIMIT 10
  `,
};
