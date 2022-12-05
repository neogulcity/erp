const DB = require("./Database");

/**
 * 거래처 등록 (CorporateRegistration)
 * 
 * DB에서 거래처 등록.
 * 
 * @param data.id 거래처 ID
 * @param data.name 거래처 명
 */
exports.CorporateRegistration = (data) => {
    return new Promise((resolve, reject) => {
        DB.Insert("거래처", {
            거래처ID: data.id,
            거래처명: data.name
        })
        .then(result => {
            resolve(true);
        });
    })
    .then((result => {return result}));
};

/**
 * 물품 등록 (GoodsRegistration)
 * 
 * DB에 거래처 물품 추가.
 * 
 * @param data.corpid 거래처 ID
 * @param data.goodsid 물품 ID
 * @param data.name 물품명
 * @param data.wholesale 도매가
 * @param data.retail 소매가
 */
exports.GoodsRegistration = (data) => {
    return new Promise((resolve, reject) => {
        DB.Query(`SELECT COUNT(*) FROM ${"`거래처`"} WHERE (${"`거래처 ID`"} = ${data.corpid});`)
        .then(qResult => {
            // 거래처 ID가 거래처 테이블에 존재하지 않음.
            if (qResult[0]["COUNT(*)"] != 1) {
                resolve(0);
                return;
            }

            DB.Query(`SELECT COUNT(*) FROM ${"`거래처 물품`"} WHERE (${"`물품 ID`"} = '${data.goodsid}');`)
            .then(qResult => {
                // 물품 ID가 거래처 물품 테이블에 이미 등록되어있음.
                if (qResult[0]["COUNT(*)"] > 0) {
                    resolve(1);
                    return;
                }

                DB.Insert("거래처 물품", {
                    거래처ID: data.corpid,
                    물품ID: data.goodsid,
                    물품명: data.name,
                    물품도매가: data.wholesale
                })
                .then(qResult => {
                    DB.Insert("전체 재고", {
                        거래처ID: data.corpid,
                        물품ID: data.goodsid,
                        물품명: data.name,
                        물품소매가: data.retail,
                        전체물품수량: 0,
                        입고수량: 0,
                        판매수량: 0
                    })
                    .then(qResult => {
                        // 등록 완료.
                        resolve(2);
                    });
                });
            });
        });
    })
    .then((result => {return result}));
};

/**
 * 발주 요청 저장 (OrderRequest)
 * 
 * 재무 관리자에게 물품 발주 요청 전송
 * 
 * @param data.id 물품 ID
 * @param data.amount 수량
 */
exports.OrderRequest = (data) => {
    return new Promise((resolve, reject) => {
        DB.Query(`SELECT * FROM ${"`거래처 물품`"} WHERE (${"`물품 ID`"} = ${data.id});`)
        .then(qResult => {
            // 물품 ID가 거래처 물품 테이블에 존재하지 않음.
            if (qResult.length == 0) {
                resolve(0);
                return;
            }

            DB.Insert("발주요청", {
                물품ID: data.id,
                거래처ID: qResult[0]["거래처 ID"],
                수량: data.amount,
                물품도매가: qResult[0]["물품 도매가"]
            })
            .then(qResult => {
                // 요청 완료.
                resolve(1);
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
 * @param item_id 물품 ID
 * @param corporate_id 거래처 ID
 * @param name 물품명
 * @param amount 입고 수량
 * @param status 입고 상태 정보
 * @param date 입고 예정 정보
 */
exports.OrderRegistration = (item_id, corporate_id, name, amount, status, date) => {
};

/**
 * 입고 처리 (Warehousing)
 * 
 * 올바른 물품인지 확인, 입고 수량 체크, 신규 물품 등록 안내
 * 
 * @param id 물품 ID
 * @param amount 수량
 */
exports.Warehousing = (id, amount) => {
    // 물품 ID, 수량 받은 후 DB에 푸시.
};

exports.GetViewData = (table) => {
    return new Promise((resolve, reject) => {
        DB.Query(`SELECT * FROM ${"`"}${table}${"`"};`)
        .then(qResult => {
            resolve(qResult);
        });
    })
    .then((result => {return result}));
};