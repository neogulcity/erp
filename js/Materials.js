const DB = require("./Database");

/**
 * 거래처 등록 (CorporateRegistration)
 * 
 * DB에서 거래처를 확인 후 물품 등록 모듈 호출.
 * 
 * @param id 거래처 ID
 * @param name 거래처 명
 */
exports.CorporateRegistration = (id, name) => {
    return new Promise((resolve, reject) => {
        DB.Insert("거래처", {
            거래처ID: id,
            거래처명: name
        })
        .then(result => {
            // 물품 등록 모듈 호출

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
 * @param id 거래처 ID
 */
exports.GoodsRegistration = (id) => {
};

/**
 * 발주 요청 저장 (OrderRequest)
 * 
 * 재무 관리자에게 물품 발주 요청 전송
 * 
 * @param id 물품 ID
 * @param amount 수량
 */
exports.OrderRequest = (id, amount) => {
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
};