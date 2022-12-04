const DB = require("../Database");
const Materials = require("../Materials");

describe("Testing Materials js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모든 테스트 수행 이후
    afterAll(async () => {
        await DB.ClearAll();
    });

    // 거래처 등록 모듈 테스트
    test("CorporateRegistration Module", async () => {
        // #1: '00001' 사원 로그인. 부서 ID '재고' 반환.
        // await Materials.CorporateRegistration("000001", "Nike");
        // let first = await DB.Query("SELECT COUNT(*) FROM `거래처` WHERE (`거래처 ID` = '000001' AND `거래처 명` = 'Nike');");
        // expect(first[0]["COUNT(*)"]).toBe(1);`
    });
});