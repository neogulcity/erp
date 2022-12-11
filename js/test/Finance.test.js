const DB = require("../Database");
const Finance = require("../Finance");

describe("Testing Finance js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모듈 테스트 수행 이후 데이터 삭제
    afterEach(async () => {
        await DB.ClearAll();
    });

    // 발주 명령 모듈 테스트
    test("OrderPermission Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("발주요청", {
            물품ID: "00000001",
            거래처ID: "000001",
            물품명: "테스트 물품 A",
            수량: "10",
            물품도매가: "100"
        });

        // #1: 발주 요청 반려시 발주 등록 X, 그대로 종료.
        const first = await Finance.OrderPermission({
            id: "1",
            value: "-1"
        });
        expect(first).toBe(true);
        
        // #2: 발주 요청 승인시 발주 등록 진행.
        const second = await Finance.OrderPermission({
            id: "1",
            value: "1"
        });
        expect(second).toBe(true);
    });

    // 발주 등록 모듈 테스트
    test("OrderRegistration Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("발주요청", {
            물품ID: "00000001",
            거래처ID: "000001",
            물품명: "테스트 물품 A",
            수량: "10",
            물품도매가: "100"
        });

        // #1: 입고 현황에 발주 정보 등록.
        const first = await Finance.OrderRegistration("1");
        expect(first).toBe(true);
    });

    // 고정 지출 입력 모듈 테스트
    test("InputFixedCost Module", async () => {
        // #1: 문자 입력시 실패.
        const first = await Finance.InputFixedCost({
            upkeep: "테스트",
            marketing: "10000",
            laborcost: "20000"
        });
        expect(first).toBe(0);

        // #2: 공백 입력시 실패.
        const second = await Finance.InputFixedCost({
            upkeep: "10000",
            marketing: "",
            laborcost: "20000"
        });
        expect(second).toBe(0);

        // #3: 정상적으로 입력시 등록 성공.
        const third = await Finance.InputFixedCost({
            upkeep: "10000",
            marketing: "20000",
            laborcost: "30000"
        });
        expect(third).toBe(2);

        // #4: 금일 고정 지출 내용 등록후 재입력 시도시 실패.
        const fourth = await Finance.InputFixedCost({
            upkeep: "1",
            marketing: "2",
            laborcost: "3"
        });
        expect(fourth).toBe(1);
    });

    // 판매 실적 기록 모듈 테스트
    test("WriteSalesPerformance Module", async () => {
        // #1: 판매 실적 업데이트
        const first = await Finance.WriteSalesPerformance();
        expect(first).toBe(true);
    });

    // 전체 재무 DB 업데이트 모듈 테스트
    test("UpdateFinancialDB Module", async () => {
        // #1: 판매 실적 업데이트
        const first = await Finance.UpdateFinancialDB();
        expect(first).toBe(true);
    });
});