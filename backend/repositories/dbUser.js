export const dbUserQueries = {

    qUserCount: 'SELECT COUNT(*) AS count FROM T_User',
    //유저의 숫자를 불러오는 쿼리
    uspCallUserEmail: 'CALL rocket_factory.USP_User_List(2, NULL, {})' 
    // Email 조회
    //CALL rocket_factory.USP_User_List(2, NULL, 'user01@example.com') -- Email 조회
    //유저의 이메일 정보를 불러오는 쿼리
    //
  };
  

  //변수 이름을 통일해서 쓴다....???

  //        repositories\dbUser.js
  

//   export const dbUserQueries = {
//     qUserAllList: 'SELECT * FROM T_User WHERE DelDT IS NULL',
//     upsUserNameList: .....

// 변수명 {q+}  USP변수명   