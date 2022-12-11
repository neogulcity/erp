const DB = require("../Database");
const Materials = require("../Materials");

describe("Testing Materials js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모듈 테스트 수행 이후 데이터 삭제
    afterEach(async () => {
        await DB.ClearAll();
    });

    // 거래처 등록 모듈 테스트
    test("CorporateRegistration Module", async () => {
        // #1: 올바르지 않은 거래처 ID, 거래처 명 입력후 실패.
        const first = await Materials.CorporateRegistration({
            id: "0",
            name: ""
        });
        expect(first).toBe(0);
        
        // #2: 올바른 거래처 ID, 거래처 명 입력후 성공.
        const second = await Materials.CorporateRegistration({
            id: "000001",
            name: "테스트 거래처"
        });
        expect(second).toBe(1);
    });

    // 물품 등록 모듈 테스트
    test("GoodsRegistration Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "테스트 거래처"
        });

        // #1: 존재하지 않는 거래처 입력시 실패.
        const first = await Materials.GoodsRegistration({
            corpid: "000002",
            goodsid: "",
            name: "",
            wholesale: "",
            retail: ""
        });
        expect(first).toBe(0);
        
        // #2: 물품 등록 성공.
        const second = await Materials.GoodsRegistration({
            corpid: "000001",
            goodsid: "00000001",
            name: "테스트 물품 A",
            wholesale: "100",
            retail: "200"
        });
        expect(second).toBe(2);

        // #3: 이미 등록된 물품 ID로 등록 시도후 실패.
        const third = await Materials.GoodsRegistration({
            corpid: "000001",
            goodsid: "00000001",
            name: "테스트 물품 B",
            wholesale: "500",
            retail: "1000"
        });
        expect(third).toBe(1);
    });

    // 물품 발주 요청 모듈 테스트
    test("OrderRequest Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "테스트 거래처"
        });
        await DB.Insert("거래처 물품", {
            거래처ID: "000001",
            물품ID: "00000001",
            물품명: "테스트 물품 A",
            물품도매가: "100"
        });

        // #1: 존재하지 않는 물품의 물품 ID 입력시 실패.
        const first = await Materials.OrderRequest({
            id: "12345678",
            amount: "10"
        });
        expect(first).toBe(0);

        // #1: 정상적인 물품 ID 입력시 성공.
        const second = await Materials.OrderRequest({
            id: "00000001",
            amount: "10"
        });
        expect(second).toBe(1);
    });

    // 입고 처리 모듈 테스트
    test("Warehousing Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("입고 현황", {
            물품ID: "00000001",
            거래처ID: "000001",
            물품명: "테스트 물품 A",
            입고수량: "10",
            입고상태정보: "0",
            입고예정정보: ""
        });
        await DB.Insert("전체 재고", {
            물품ID: "00000001",
            거래처ID: "000001",
            물품명: "테스트 물품 A",
            전체물품수량: "0",
            입고수량: "0",
            판매수량: "0",
            물품소매가: "200"
        });

        // #1: 입고 현황에 존재하지 않는 물품 ID 입력시 실패.
        const first = await Materials.Warehousing({
            id: "12345678"
        });
        expect(first).toBe(0);

        // #2: 입고 대기중인 물품 ID 입력시 성공.
        const second = await Materials.Warehousing({
            id: "00000001"
        });
        expect(second).toBe(2);
    });
});