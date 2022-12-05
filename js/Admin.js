const DB = require("./Database");

/**
 * 로그인 (Login)
 * 
 * 사번, 비밀번호 확인 후 데이터 존재 여부 반환.
 * 
 * @param data.id 사번
 * @param data.pw 비밀번호
 * @return 관리자 정보 튜플 반환 `object`
 */
exports.Login = (data) => {
    // SQL 쿼리의 비동기로 인해 데이터 조회전에 값이 return 되는 것을 방지하기 위해
    // Promise를 사용해 동기적으로 진행.
    return new Promise((resolve, reject) => {        
        DB.Query(`SELECT * FROM ${"`관리자 명단`"} WHERE ${"`사번`"} = '${data.id}' AND ${"`비밀번호`"} = '${data.pw}';`)
        .then(qResult => {
            if (qResult.length == 0) {
                resolve(null);
            } else {
                resolve(qResult[0]);
            }
        });
    })
    .then((result => {return result}));
};