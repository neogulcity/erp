const DB = require("./Database");

/**
 * 발주 명령 (OrderPermission)
 * 
 * 발주 요청 처리
 * 
 * @param data.id 발주 ID
 * @param data.value 처리 결과
 */
 exports.OrderPermission = (data) => {
    return new Promise((resolve, reject) => {
        DB.Query("UPDATE `발주요청` SET `처리 구분` = " + `${data.value} WHERE (` + "`발주 ID`" + ` = ${data.id});`)
        .then(qResult => {
            if (data.value != 1) {
                resolve(true);
                return;
            }
            
            OrderRegistration(data.id)
            .then(result => {
                resolve(true);
            });
        });
    })
    .then((result => {return result}));
};

/**
 * 발주 등록 (OrderRegistration)
 * 
 * DB에 발주 정보 등록.
 * 
 * @param id 발주 ID
 */
const OrderRegistration = (id) => {
    return new Promise((resolve, reject) => {
        DB.Query("SELECT * FROM `발주요청` WHERE (`발주 ID` = " + `${id});`)
        .then(qResult => {
            DB.Insert("입고 현황", {
                물품ID: qResult[0]["물품 ID"],
                거래처ID: qResult[0]["거래처 ID"],
                물품명: qResult[0]["물품명"],
                입고수량: qResult[0]["수량"],
                입고상태정보: 0,
                입고예정정보: ""
            })
            .then(qResult => {
                resolve(true);
            });
        });
    })
    .then((result => {return result}));
};

/**
 * 고정비 입력 (InputFixedCost)
 * 
 * 고정비 입력
 * 
 * @param data.upkeep 기업 유지비
 * @param data.marketing 마케팅비
 * @param data.laborcost 인건비
 */
 exports.InputFixedCost = (data) => {
    return new Promise((resolve, reject) => {
        let date = new Date();   
        let today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDay();

        DB.Query(`SELECT * FROM ${"`고정 지출`"} WHERE (${"`날짜`"} = '${today}');`)
        .then(qResult => {
            // 날짜가 고정 지출 테이블에 존재하지 않음.
            if (qResult.length != 0) {
                resolve(0);
                return;
            }

            DB.Insert("고정 지출", {
                기업유지비: data.upkeep,
                마케팅비: data.marketing,
                인건비: data.laborcost
            })
            .then(result => {
                resolve(1);
            });
        });
        
    })
    .then((result => {return result}));
};