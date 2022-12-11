const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session  = require('express-session');
const flash    = require('connect-flash');

const Shared = require("./js/Shared");
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
        req.flash('loginInfo');
        res.render("loginpage", {});
    });

    app.get("/Main", function(req, res) {
        let loginInfo = req.flash('loginInfo');
        req.flash('loginInfo', loginInfo);
        res.render("mainpage", {'data':loginInfo[0]});
    });

    // 재고 관리자
    {
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

        // 입고 처리 페이지
        app.get("/Warehousingpage", function(req, res) {
            res.render("Materials/Warehousingpage", {});
        });

        // 전체 재고 조회 페이지
        app.get("/ViewAllGoodspage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Materials/ViewAllGoodspage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Materials/ViewAllGoodspage", {data:searchInfo});
                return;
            }
            
            Shared.GetViewData("전체 재고")
            .then(result => {
                res.render("Materials/ViewAllGoodspage", {data:result});
            });
        });

        // 거래처 조회 페이지
        app.get("/ViewCorppage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Materials/ViewCorppage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Materials/ViewCorppage", {data:searchInfo});
                return;
            }
            
            Shared.GetViewData("거래처")
            .then(result => {
                res.render("Materials/ViewCorppage", {data:result});
            });
        });

        // 거래처 물품 조회 페이지
        app.get("/ViewCorpGoodspage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Materials/ViewCorpGoodspage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Materials/ViewCorpGoodspage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("거래처 물품")
            .then(result => {
                res.render("Materials/ViewCorpGoodspage", {data:result});
            });
        });

        // 입고 현황 조회 페이지
        app.get("/ViewWarehousingpage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Materials/ViewWarehousingpage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Materials/ViewWarehousingpage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("입고 현황")
            .then(result => {
                res.render("Materials/ViewWarehousingpage", {data:result});
            });
        });

        // 발주 요청 조회 페이지
        app.get("/ViewOrderReqpage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Materials/ViewOrderReqpage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Materials/ViewOrderReqpage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("발주요청")
            .then(result => {
                res.render("Materials/ViewOrderReqpage", {data:result});
            });
        });

        // 거래처 등록 모듈
        app.post('/CorporateRegistration', function(req, res) {
            Materials.CorporateRegistration(req.body)
            .then(result => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                switch (result) {
                case 0:
                    res.write("<script>alert('다시 입력해 주세요.')</script>");
                    break;

                case 1:
                    res.write("<script>alert('등록되었습니다.')</script>");
                    break;
                }
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

        // 입고 처리 모듈
        app.post('/Warehousing', function(req, res) {
            Materials.Warehousing(req.body)
            .then(result => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                switch (result) {
                case 0:
                    res.write("<script>alert('입고 예정에 없던 품목입니다.')</script>");
                    break;
                
                case 1:
                    res.write("<script>alert('물품 등록을 진행해주십시오.')</script>");
                    break;

                case 2:
                    res.write("<script>alert('처리되었습니다.')</script>");
                    break;
                }
                res.write("<script>window.location=\"/Warehousingpage\"</script>");
            });
        });
    }

    // 재무 관리자
    {
        // 발주 요청 목록 조회 페이지
        app.get("/ProcessOrderReqpage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Finance/ProcessOrderReqpage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Finance/ProcessOrderReqpage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("발주요청")
            .then(result => {
                res.render("Finance/ProcessOrderReqpage", {data:result});
            });
        });

        // 발주 명령 모듈
        app.post('/OrderPermission', function(req, res) {
            Finance.OrderPermission(req.body)
            .then(result => {
                res.write("<script>location.reload(); window.location=\"/ProcessOrderReqpage\"</script>");
            });
        });

        // 고정비 입력 페이지
        app.get("/InputFixedCostpage", function(req, res) {
            res.render("Finance/InputFixedCostpage", {});
        });

        // 고정비 입력 모듈
        app.post('/InputFixedCost', function(req, res) {
            Finance.InputFixedCost(req.body)
            .then(result => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                switch (result) {
                case 0:
                    res.write("<script>alert('다시 입력해 주세요.')</script>");
                    break;

                case 1:
                    res.write("<script>alert('이미 등록되었습니다.')</script>");
                    break;
                
                case 2:
                    res.write("<script>alert('등록되었습니다.')</script>");
                    break;
                }
                res.write("<script>window.location=\"/InputFixedCostpage\"</script>");
            });
        });

        // 전체 재무 조회 페이지
        app.get("/ViewAllFinancepage", function(req, res) {
            Finance.UpdateFinancialDB()
            .then(result => {
                let searchInfo = req.flash('searchInfo');
                if (searchInfo == "false") {
                    res.render("Finance/ViewAllFinancepage", {data:[]});
                    return;
                } else if (JSON.stringify(searchInfo) != "[]") {
                    res.render("Finance/ViewAllFinancepage", {data:searchInfo});
                    return;
                }

                Shared.GetViewData("전체 재무")
                .then(result => {
                    res.render("Finance/ViewAllFinancepage", {data:result});
                });
            });
        });

        // 고정 지출 금액 조회 페이지
        app.get("/ViewAllFixedCostpage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Finance/ViewAllFixedCostpage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Finance/ViewAllFixedCostpage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("고정 지출")
            .then(result => {
                res.render("Finance/ViewAllFixedCostpage", {data:result});
            });
        });

        // 직원 명단 조회 페이지
        app.get("/ViewEmployeepage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Finance/ViewEmployeepage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Finance/ViewEmployeepage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("직원 명단")
            .then(result => {
                res.render("Finance/ViewEmployeepage", {data:result});
            });
        });

        // 판매 실적 조회 페이지
        app.get("/ViewSalespage", function(req, res) {
            Finance.WriteSalesPerformance()
            .then(result => {
                let searchInfo = req.flash('searchInfo');
                if (searchInfo == "false") {
                    res.render("Finance/ViewSalespage", {data:[]});
                    return;
                } else if (JSON.stringify(searchInfo) != "[]") {
                    res.render("Finance/ViewSalespage", {data:searchInfo});
                    return;
                }

                Shared.GetViewData("판매 실적")
                .then(result => {
                    res.render("Finance/ViewSalespage", {data:result});
                });
            });
        });
    }

    // 고객 관리자
    {
        // CS 목록 조회 페이지
        app.get("/ViewCspage", function(req, res) {
            let searchInfo = req.flash('searchInfo');
            if (searchInfo == "false") {
                res.render("Cs/ViewCspage", {data:[]});
                return;
            } else if (JSON.stringify(searchInfo) != "[]") {
                res.render("Cs/ViewCspage", {data:searchInfo});
                return;
            }

            Shared.GetViewData("cs")
            .then(result => {
                res.render("Cs/ViewCspage", {data:result});
            });
        });
    }

    // 로그인 모듈
    app.post('/Login', function(req, res) {
        Shared.Login(req.body)
        .then(result => {
            if (result == null) {
                res.writeHead(302, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write("<script>alert('다시 입력해 주세요.')</script>");
                res.write("<script>window.location=\"/\"</script>");
            } else {
                req.flash('loginInfo', result);
                res.redirect('/Main');
            }
        });
    });

    // 검색 모듈
    app.post('/Search', function(req, res) {
        Shared.Search(req.body)
        .then(result => {
            req.flash('searchInfo', result);
            res.redirect('/' + req.body.page);
        });
    });

    return app;
};

module.exports = { createApp };