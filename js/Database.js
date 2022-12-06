require('dotenv').config();

const dbconfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
const mysql = require('mysql');

/**
 * DB에 데이터 추가.
 * 
 * @param table 테이블 명
 * @param data 추가할 데이터 (json)
 */
exports.Insert = (table, data) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbconfig);
        connection.connect();

        let sql = `INSERT INTO ${"`"}${table}${"`"} VALUES (`;

        switch(table) {
        case "cs":
            sql += `'${data["CSID"]}', '${data["고객ID"]}', '${data["건의내용"]}');`;
            break;
        
        case "거래처":
            sql += `'${data["거래처ID"]}', '${data["거래처명"]}');`;
            break;

        case "거래처 물품":
            sql += `'${data["거래처ID"]}', '${data["물품ID"]}', '${data["물품명"]}', '${data["물품도매가"]}');`;
            break;

        case "고정 지출":
            let date = new Date();   
            let today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDay();
            sql += `'${today}', '${data["기업유지비"]}', '${data["마케팅비"]}', '${data["인건비"]}');`;
            break;

        case "관리자 명단":
            sql += `'${data["사번"]}', '${data["비밀번호"]}', '${data["관리자명"]}', '${data["부서ID"]}');`;
            break;
        
        case "발주요청":
            sql = `INSERT INTO ${"`"}${table}${"`"} ` + "(`물품 ID`, `거래처 ID`, `물품명`, `수량`, `물품 도매가`) VALUES (";
            sql += `'${data["물품ID"]}', '${data["거래처ID"]}', '${data["물품명"]}', '${data["수량"]}', '${data["물품도매가"]}');`;
            break;
        
        case "입고 현황":
            sql += `'${data["물품ID"]}', '${data["거래처ID"]}', '${data["물품명"]}', `;
            sql += `'${data["입고수량"]}', '${data["입고상태정보"]}', '${data["입고예정정보"]}');`;
            break;

        case "전체 재고":
            sql += `'${data["물품ID"]}', '${data["거래처ID"]}', '${data["물품명"]}', '${data["전체물품수량"]}', `;
            sql += `'${data["입고수량"]}', '${data["판매수량"]}', '${data["물품소매가"]}');`;
            break;

        case "전체 재무":
            sql += `'${data["날짜"]}', '${data["전체재무정보"]}', '${data["판매수익"]}', `;
            sql += `'${data["고정지출비용"]}', '${data["발주비용"]}');`;
            break;

        case "직원 명단":
            sql += `'${data["사번"]}', '${data["직원명"]}', '${data["직급"]}', `;
            sql += `'${data["월급"]}', '${data["성과급여"]}', '${data["비고"]}');`;
            break;

        case "판매 실적":
            sql += `'${data["물품ID"]}', '${data["발주비용"]}', '${data["판매수익"]}', '${data["총계"]}');`;
            break;
        }

        connection.query(sql, function(err, results, fields) {
            connection.end();
            if(err) {
                console.log(err);
            }

            resolve(true);
        });
    })
    .then((result => {return result}));
}

/**
 * DB에 Query 실행.
 * 
 * @param sql 실행할 Query
 * @return `RowDataPacket`
 */
exports.Query = (sql) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbconfig);
        connection.connect();

        connection.query(sql, function(err, results, fields) {
            connection.end();
            if(err) {
                console.log(err);
            }

            resolve(results);
        });
    })
    .then((result => {return result}));
}


/**
 * DB 존재하는 모든 데이터 삭제. (WIP)
 */
exports.ClearAll = () => {
    return new Promise((resolve, reject) => {
        let sql = {
            0: "SET FOREIGN_KEY_CHECKS = 0;",
            1: "TRUNCATE `cs`;",
            // 2: "TRUNCATE `거래처`;",
            3: "TRUNCATE `거래처 물품`;",
            4: "TRUNCATE `고정 지출`;",
            5: "TRUNCATE `관리자 명단`;",
            6: "TRUNCATE `발주요청`;",
            7: "TRUNCATE `입고 현황`;",
            8: "TRUNCATE `전체 재고`;",
            9: "TRUNCATE `전체 재무`;",
            10: "TRUNCATE `직원 명단`;",
            11: "TRUNCATE `판매 실적`;",
            12: "SET FOREIGN_KEY_CHECKS = 1;"
        };
        let DoClear = async () => {
            for (let elem in sql) {
                await this.Query(sql[elem]);
            }
            resolve(true);
        };
        DoClear();
    })
    .then((result => {return result}));
}