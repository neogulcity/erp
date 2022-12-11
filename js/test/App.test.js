const DB = require("../Database");
const request = require("supertest");
const { createApp } = require("../../app");

describe("Integral Testing...", () => {
    let app;
  
    // 테스트 수행 이전
    beforeAll(async() => {
        app = createApp();
    });
  
    // 모듈 테스트 수행 이후 데이터 삭제
    afterEach(async () => {
        await DB.ClearAll();
    });

    /* 공통 모듈 통합 테스트 */
    {
        // 로그인 모듈 테스트
        test("/Login", async() => {
            // 테스트를 위한 데이터 삽입
            await DB.Insert("관리자 명단", {
                사번: "00001",
                비밀번호: "1234",
                관리자명: "kim",
                부서ID: "재고"
            });

            // #1: '00001' 사원 로그인 성공, 메인 페이지로 이동.
            await request(app)
            .post("/Login")
            .send({
                id: "00001",
                pw: "1234"
            })
            .expect('Location', '/Main')
        });

        // 검색 모듈 테스트
        test("/Search", async() => {
            // 테스트를 위한 데이터 삽입
            await DB.Insert("거래처", {
                거래처ID: "000001",
                거래처명: "테스트 거래처"
            });

            // #1: 거래처 테이블 데이터 검색 수행.
            await request(app)
            .post("/Search")
            .send({
                table: "거래처",
                target: "테스트 거래처",
                page: "ViewCorppage"
            })
            .expect('Location', '/ViewCorppage')
        });
    }

    /* 재고 관리 통합 테스트 */
    {
        // 거래처 등록 페이지 테스트
        test("/CorpRegipage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/CorpRegipage")
            .expect(200)
        });

        // 물품 등록 페이지 테스트
        test("/GoodsRegipage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/GoodsRegipage")
            .expect(200)
        });

        // 발주 요청 저장 페이지 테스트
        test("/OrderRequestpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/OrderRequestpage")
            .expect(200)
        });

        // 입고 처리 페이지 테스트
        test("/Warehousingpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/Warehousingpage")
            .expect(200)
        });

        // 전체 재고 조회 페이지 테스트
        test("/ViewAllGoodspage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewAllGoodspage")
            .expect(200)
        });

        // 거래처 조회 페이지 테스트
        test("/ViewCorppage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewCorppage")
            .expect(200)
        });

        // 거래처 물품 조회 페이지 테스트
        test("/ViewCorpGoodspage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewCorpGoodspage")
            .expect(200)
        });

        // 입고 현황 조회 페이지 테스트
        test("/ViewWarehousingpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewWarehousingpage")
            .expect(200)
        });

        // 발주 요청 조회 페이지 테스트
        test("/ViewOrderReqpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewOrderReqpage")
            .expect(200)
        });
    }

    /* 재무 관리 통합 테스트 */
    {
        // 발주 요청 목록 조회 페이지 테스트
        test("/ProcessOrderReqpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ProcessOrderReqpage")
            .expect(200)
        });

        // 고정비 입력 페이지 테스트
        test("/InputFixedCostpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/InputFixedCostpage")
            .expect(200)
        });

        // 전체 재무 조회 페이지 테스트
        test("/ViewAllFinancepage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewAllFinancepage")
            .expect(200)
        });

        // 고정 지출 금액 조회 페이지 테스트
        test("/ViewAllFixedCostpage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewAllFixedCostpage")
            .expect(200)
        });

        // 직원 명단 조회 페이지 테스트
        test("/ViewEmployeepage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewEmployeepage")
            .expect(200)
        });

        // 판매 실적 조회 페이지 테스트
        test("/ViewSalespage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewSalespage")
            .expect(200)
        });
    }

    /* 고객 관리 통합 테스트 */
    {
        // CS 목록 조회 페이지 테스트
        test("/ViewCspage", async() => {
            // #1: 요청 성공, HTTP Status Code:200 "OK"
            await request(app)
            .get("/ViewCspage")
            .expect(200)
        });
    }
});