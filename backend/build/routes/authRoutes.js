"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkToken_1 = require("../middlewares/checkToken");
const userControllers_1 = require("../controllers/userControllers");
const route = (0, express_1.Router)();
var scode;
(function (scode) {
    scode[scode["Ok"] = 200] = "Ok";
    scode[scode["Cbad"] = 400] = "Cbad";
})(scode || (scode = {}));
route.post('/signup', userControllers_1.userSignUp);
route.post('/login', userControllers_1.userLogIn);
route.get('/jwtChecking', checkToken_1.checkToken, userControllers_1.jwtChecking);
exports.default = route;
