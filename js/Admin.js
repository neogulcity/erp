const DB = require("./Database");

/**
 * 로그인 (Login)
 * 
 * 사번, 비밀번호 확인 후 데이터 존재 여부 반환.
 * 
 * @param id 사번
 * @param pw 비밀번호
 * @return 부서 ID 반환 (재고 | 재무 | 고객) `pageid`
 */
exports.Login = (id, pw) => {
    // SQL 쿼리의 비동기로 인해 데이터 조회전에 값이 return 되는 것을 방지하기 위해
    // Promise를 사용해 동기적으로 진행.
    return new Promise((resolve, reject) => {

        // SELECT `부서 ID` FROM `관리자 명단` WHERE `사번` = '00001' AND `비밀번호` = '1234';
        let sql = `SELECT ${"`부서 ID`"} FROM ${"`관리자 명단`"} WHERE ${"`사번`"} = '${id}' AND ${"`비밀번호`"} = '${pw}';`;
        
        DB.Query(sql).then(qResult => {
            switch(qResult.length) {
            // #1 데이터 없음
            case 0:
                resolve(null);
                break;
            
            // #2 사번, 비밀번호 일치
            case 1:
                resolve(qResult[0]["부서 ID"]);
                break;
            
            // #3 사번, 비밀번호 일치 데이터 > 2
            // DB 내부에 중복 데이터가 존재
            default:
                resolve(null);
            }
        });
    })
    .then((result => {return result}));
};