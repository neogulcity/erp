const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session  = require('express-session');
const flash    = require('connect-flash');

const Admin = require("./js/Admin");
const Materials = require("./js/Materials");
const Finance = require("./js/Finance");

const createApp = () => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/public'));
    app.use(flash());
    app.use(session({
        secret: 'afsdfiuhaiufheui123uh1i2hiuhqwd',
        resave: false,
        saveUninitialized: true
    }));

    app.get("/", function(req, res) {
        res.render("loginpage", {});
    });

    app.get("/Main", function(req, res) {
        let loginInfo = req.flash('loginInfo');
        res.render("mainpage", {'data':loginInfo[0]});
    });

    // 거래처 등록 페이지
    app.get("/CorpRegipage", function(req, res) {
        res.render("Materials/CorpRegipage", {});
    });

    // 물품 등록 페이지
    app.get("/GoodsRegipage", function(req, res) {
        res.render("Materials/GoodsRegipage", {});
    });

    // 발주 요청 저장 페이지
    app.get("/OrderRequestpage", function(req, res) {
        res.render("Materials/OrderRequestpage", {});
    });

    // 전체 재고 조회 페이지
    app.get("/ViewAllGoodspage", function(req, res) {
        Materials.GetViewData("전체 재고")
        .then(result => {
            res.render("Materials/ViewAllGoodspage", {data:result});
        });
    });

    // 거래처 조회 페이지
    app.get("/ViewCorppage", function(req, res) {
        Materials.GetViewData("거래처")
        .then(result => {
            res.render("Materials/ViewCorppage", {data:result});
        });
    });

    // 거래처 물품 조회 페이지
    app.get("/ViewCorpGoodspage", function(req, res) {
        Materials.GetViewData("거래처 물품")
        .then(result => {
            res.render("Materials/ViewCorpGoodspage", {data:result});
        });
    });

    // 입고 현황 조회 페이지
    app.get("/ViewWarehousingpage", function(req, res) {
        Materials.GetViewData("입고 현황")
        .then(result => {
            res.render("Materials/ViewWarehousingpage", {data:result});
        });
    });

    // 발주 요청 조회 페이지
    app.get("/ViewOrderReqpage", function(req, res) {
        Materials.GetViewData("발주요청")
        .then(result => {
            res.render("Materials/ViewOrderReqpage", {data:result});
        });
    });

    // 로그인 모듈
    app.post('/Login', function(req, res) {
        Admin.Login(req.body)
        .then(result => {
            if (result == null) {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write("<script>alert('다시 입력해 주세요.')</script>");
                res.write("<script>window.location=\"/\"</script>");
            } else {
                req.flash('loginInfo', result);
                res.redirect('/Main');
            }
        });
    });

    // 거래처 등록 모듈
    app.post('/CorporateRegistration', function(req, res) {
        Materials.CorporateRegistration(req.body)
        .then(result => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write("<script>alert('등록되었습니다.')</script>");
            res.write("<script>window.location=\"/CorpRegipage\"</script>");
        });
    });

    // 물품 등록 모듈
    app.post('/GoodsRegistration', function(req, res) {
        Materials.GoodsRegistration(req.body)
        .then(result => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            switch (result) {
            case 0:
                res.write("<script>alert('거래처 등록을 먼저 진행해주십시오.')</script>");
                break;
            
            case 1:
                res.write("<script>alert('이미 등록되어 있는 물품입니다.')</script>");
                break;

            case 2:
                res.write("<script>alert('등록되었습니다.')</script>");
                break;
            }
            res.write("<script>window.location=\"/GoodsRegipage\"</script>");
        });
    });

    // 발주 요청 저장 모듈
    app.post('/OrderRequest', function(req, res) {
        Materials.OrderRequest(req.body)
        .then(result => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            switch (result) {
                case 0:
                    res.write("<script>alert('존재하지 않는 물품ID 입니다.')</script>");
                    break;
                
                case 1:
                    res.write("<script>alert('발주 요청 완료.')</script>");
                    break;
            }
            res.write("<script>window.location=\"/OrderRequestpage\"</script>");
        });
    });

    return app;
};

module.exports = { createApp };