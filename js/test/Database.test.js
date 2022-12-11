const DB = require("../Database");

describe("Testing Database js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모듈 테스트 수행 이후 데이터 삭제
    afterEach(async () => {
        await DB.ClearAll();
    });

    // DB 데이터 입력 모듈 테스트
    test("DB Insert Module", async () => {
        // #1: cs 테이블에 데이터 입력.
        await DB.Insert("cs", {
            CSID: "0000000001",
            고객ID: "000000000000001",
            건의내용: "테스트 내용"
        });
        const first = await DB.Query("SELECT * FROM `cs`;");
        expect(first[0]["CS ID"]).toBe("0000000001");
        expect(first[0]["고객 ID"]).toBe("000000000000001");
        expect(first[0]["건의 내용"]).toBe("테스트 내용");
    });

    // DB Query 입력 모듈 테스트
    test("DB Query Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "테스트 거래처"
        });

        // #1: 거래처 테이블에서 SELECT 실행후 데이터 입력 확인.
        const first = await DB.Query("SELECT * FROM `거래처`;");
        expect(first[0]["거래처 ID"]).toBe("000001");
        expect(first[0]["거래처 명"]).toBe("테스트 거래처");
    });

    // DB 전체 데이터 삭제 모듈 테스트
    test("DB ClearAll Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "테스트 거래처"
        });

        // #1: 전체 데이터 삭제후 빈 거래처 테이블.
        await DB.ClearAll();
        const first = await DB.Query("SELECT * FROM `거래처`;");
        expect(first).toStrictEqual([]);
    });
});