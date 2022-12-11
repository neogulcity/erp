const DB = require("../Database");
const Shared = require("../Shared");

describe("Testing Shared js...", () => {  
    // 테스트 수행 이전
    beforeAll(async () => {
    });
  
    // 모듈 테스트 수행 이후 데이터 삭제
    afterEach(async () => {
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

        // #1: '00001' 사원 로그인. 사원 정보 반환.
        const first = await Shared.Login({
            id: "00001",
            pw: "1234"
        });
        expect(first["사번"]).toBe("00001");
        expect(first["비밀번호"]).toBe("1234");
        expect(first["관리자 명"]).toBe("kim");
        expect(first["부서 ID"]).toBe("재고");

        // #2: '00002' 사원 로그인 시도, 존재하지 않는 사원.
        const second = await Shared.Login({
            id: "00002",
            pw: "1234"
        });
        expect(second).toBe(null);
    });

    test("GetViewData Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "테스트 거래처"
        });

        // #1: 거래처 테이블 데이터 요청.
        const first = await Shared.GetViewData("거래처");
        expect(first[0]["거래처 ID"]).toBe("000001");
        expect(first[0]["거래처 명"]).toBe("테스트 거래처");
    });

    test("Search Module", async () => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("거래처", {
            거래처ID: "000001",
            거래처명: "A"
        });
        await DB.Insert("거래처", {
            거래처ID: "000002",
            거래처명: "B"
        });

        // #1: 거래처 테이블 데이터 검색.
        // 검색대상: 거래처명이 'A' 인 거래처.
        const first = await Shared.Search({
            table: "거래처",
            target: "A"
        });
        expect(first[0]["거래처 ID"]).toBe("000001");
        expect(first[0]["거래처 명"]).toBe("A");
        expect(first[1]).toBe(undefined);
    });
});