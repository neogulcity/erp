const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');

const Admin = require("./js/Admin");
const Materials = require("./js/Materials");
const Finance = require("./js/Finance");

const createApp = () => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/'));

    app.get("/", function(req, res) {
        res.render("example", {});
    });

    app.get("/materials", function(req, res) {
        res.render("example_materials", {});
    });

    app.get("/finance", function(req, res) {
        res.render("example_finance", {});
    });

    app.get("/cs", function(req, res) {
        res.render("example_cs", {});
    });

    // 로그인 모듈
    app.post('/Login', function(req, res) {
        Admin.Login(req.body.id, req.body.pw)
        .then(result => {
            res.json({pageid:result});
        });
    });

    // 거래처 등록 모듈
    app.post('/CorporateRegistration', function(req, res) {
        Materials.CorporateRegistration(req.body.id, req.body.name)
        .then(result => {
            res.json({});
        });
    });

    return app;
};

module.exports = { createApp };