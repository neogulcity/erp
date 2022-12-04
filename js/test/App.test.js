const DB = require("../Database");
const request = require("supertest");
const { createApp } = require("../../app");

describe("Integral Testing...", () => {
    let app;
  
    // 테스트 수행 이전
    beforeAll(async() => {
        app = createApp();
    });
  
    // 모든 테스트 수행 이후
    afterAll(async() => {
        await DB.ClearAll();
    });

    // 로그인 모듈 테스트
    test("/Login", async() => {
        // 테스트를 위한 데이터 삽입
        await DB.Insert("관리자 명단", {
            사번: "00001",
            비밀번호: "1234",
            관리자명: "kim",
            부서ID: "재고"
        });

        // #1: '00001' 사원 로그인. 부서 ID '재고' 반환.
        await request(app)
        .post("/Login")
        .send({ id: "00001", pw: "1234" })
        .expect({ pageid: "재고" });

        // #2: '00002' 사원 로그인 시도, 존재하지 않는 사원.
        await request(app)
        .post("/Login")
        .send({ id: "00002", pw: "1234" })
        .expect({ pageid: null });
    });
});