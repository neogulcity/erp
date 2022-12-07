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

/**
 * SQL Query를 통해 테이블의 튜플을 받아온다.
 * 
 * @param table 테이블 명
 */
exports.GetViewData = (table) => {
    return new Promise((resolve, reject) => {
        DB.Query(`SELECT * FROM ${"`"}${table}${"`"};`)
        .then(qResult => {
            resolve(qResult);
        });
    })
    .then((result => {return result}));
};

/**
 * SQL Query를 통해 테이블별 데이터를 검색한다.
 * 
 * @param data.table 테이블 명
 * @param data.target 찾을 데이터 명
 */
exports.Search = (data) => {
    return new Promise((resolve, reject) => {
        let sql = null;
        switch (data.table) {
        case "전체 재고":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`물품 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `거래처 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품명` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;
        
        case "거래처 물품":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`거래처 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품명` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "거래처":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`거래처 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `거래처 명` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "발주요청":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`발주 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `거래처 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품명` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "입고 현황":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`물품 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `거래처 ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `물품명` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "전체 재무":
        case "고정 지출":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`날짜` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "직원 명단":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`사번` = ";
            sql += `'${data.target}'`;
            sql += " OR `직원명` = ";
            sql += `'${data.target}'`;
            sql += " OR `직급` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "판매 실적":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`물품 ID` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;

        case "cs":
            sql = `SELECT * FROM ${"`"}${data.table}${"`"} `;
            sql += "WHERE (`CS ID` = ";
            sql += `'${data.target}'`;
            sql += " OR `고객 ID` = ";
            sql += `'${data.target}'`;
            sql += ");"
            break;
        }

        DB.Query(sql)
        .then(qResult => {
            if (qResult.length == 0) {
                resolve("false");
                return;
            }

            resolve(qResult);
        });
    })
    .then((result => {return result}));
};