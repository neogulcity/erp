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
        if (data.id.length != 6) {
            resolve(0);
            return;
        }

        DB.Insert("거래처", {
            거래처ID: data.id,
            거래처명: data.name
        })
        .then(result => {
            resolve(1);
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
        DB.Query(`SELECT COUNT(*) FROM ${"`거래처`"} WHERE (${"`거래처 ID`"} = '${data.corpid}');`)
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
        DB.Query(`SELECT * FROM ${"`거래처 물품`"} WHERE (${"`물품 ID`"} = '${data.id}');`)
        .then(qResult => {
            // 물품 ID가 거래처 물품 테이블에 존재하지 않음.
            if (qResult.length == 0) {
                resolve(0);
                return;
            }

            DB.Insert("발주요청", {
                물품ID: data.id,
                거래처ID: qResult[0]["거래처 ID"],
                물품명: qResult[0]["물품명"],
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
 * 입고 처리 (Warehousing)
 * 
 * 올바른 물품인지 확인, 입고 수량 체크, 신규 물품 등록 안내
 * 
 * @param data.id 물품 ID
 */
exports.Warehousing = (data) => {
    let amount = null;
    return new Promise((resolve, reject) => {
        DB.Query(`SELECT * FROM ${"`입고 현황`"} WHERE (${"`물품 ID`"} = '${data.id}');`)
        .then(qResult => {
            // 물품 ID가 입고 현황 테이블에 존재하지 않음.
            if (qResult.length == 0) {
                resolve(0);
                return;
            }
            amount = qResult[0]["입고 수량"];
            
            DB.Query(`SELECT * FROM ${"`전체 재고`"} WHERE (${"`물품 ID`"} = '${data.id}');`)
            .then(qResult => {
                // 물품 ID가 전체 재고 테이블에 존재하지 않음.
                if (qResult.length == 0) {
                    resolve(1);
                    return;
                }
                let newAmount = qResult[0]["입고 수량"] + amount;
                let newAllGoodsVal = qResult[0]["전체 물품 수량"] + amount;

                DB.Query("UPDATE `전체 재고` SET `전체 물품 수량` = " + `${newAllGoodsVal} WHERE (` + "`물품 ID`" + ` = ${data.id});`)
                .then(qResult => {
                    DB.Query("UPDATE `전체 재고` SET `입고 수량` = " + `${newAmount} WHERE (` + "`물품 ID`" + ` = ${data.id});`)
                    .then(qResult => {
                        DB.Query("DELETE FROM `입고 현황` WHERE (`물품 ID` = " + `'${data.id}');`)
                        .then(qResult => {
                            resolve(2);
                        });
                    });
                });
            });
        });
    })
    .then((result => {return result}));
};