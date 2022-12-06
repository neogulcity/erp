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
        let today = date.getFullYear() + '/' + (date.getMonth() + 1);

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

/**
 * 판매 실적 기록 (WriteSalesPerformance)
 * 
 * 판매 실적 기록
 */
 exports.WriteSalesPerformance = () => {
    return new Promise((resolve, reject) => {
        DB.Query("SELECT * FROM `전체 재고`;")
        .then(qResult => {
            for (var i = 0; i < qResult.length; i++) {
                id = qResult[i]["물품 ID"];
                income = qResult[i]["판매 수량"] * qResult[i]["물품 소매가"];
                orderedAmount = qResult[i]["입고 수량"];

                DB.Query("SELECT * FROM `거래처 물품` WHERE (`거래처 ID` = " + `'${qResult[i]["거래처 ID"]}'` + " AND `물품 ID` = " + `${qResult[i]["물품 ID"]});`)
                .then(qResult => {
                    spending = orderedAmount * qResult[0]["물품 도매가"];
                    total = income - spending;

                    DB.Insert("판매 실적", {
                        물품ID: id,
                        발주비용: spending,
                        판매수익: income,
                        총계: total
                    })
                    .then(result => {
                    });
                });
            }
            resolve(true);
        });
    })
    .then((result => {return result}));
};

/**
 * 전체 재무 DB 업데이트 (UpdateFinancialDB)
 * 
 * 전체 재무 DB 업데이트
 * 
 */
exports.UpdateFinancialDB = () => {
    return new Promise((resolve, reject) => {
        DB.Query("SELECT * FROM `고정 지출`;")
        .then(qResult => {
            id = null;
            fixedCost = 0;
            for (var i = 0; i < qResult.length; i++) {
                id = qResult[i]["날짜"];
                fixedCost = qResult[i]["기업 유지비"] + qResult[i]["마케팅비"] + qResult[i]["인건비"];
            }
            DB.Query("SELECT * FROM `판매 실적`;")
            .then(qResult => {
                totalIncome = 0;
                totalSpending = 0;
                for (var i = 0; i < qResult.length; i++) {
                    totalIncome += qResult[i]["판매 수익"];
                    totalSpending += qResult[i]["발주 비용"];
                }
                totalFinance = totalIncome - totalSpending - fixedCost;
                DB.Insert("전체 재무", {
                    날짜: id,
                    전체재무정보: totalFinance,
                    판매수익: totalIncome,
                    고정지출비용: fixedCost,
                    발주비용: totalSpending
                })
                .then(result => {
                    resolve(true);
                });
            });
        });
    })
    .then((result => {return result}));
};