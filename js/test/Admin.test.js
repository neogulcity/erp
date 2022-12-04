const DB = require("../Database");
const Admin = require("../Admin");

describe("Testing Default Admin js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모든 테스트 수행 이후
    afterAll(async () => {
        await DB.ClearAll();
    });

    // 로그인 모듈 테스트
    test("Login Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("관리자 명단", {
            사번: "00001",
            비밀번호: "1234",
            관리자명: "kim",
            부서ID: "재고"
        });

        // #1: '00001' 사원 로그인. 부서 ID '재고' 반환.
        const first = await Admin.Login("00001", "1234");
        expect(first).toBe("재고");

        // #2: '00002' 사원 로그인 시도, 존재하지 않는 사원.
        const second = await Admin.Login("00002", "1234");
        expect(second).toBe(null);
    });
});