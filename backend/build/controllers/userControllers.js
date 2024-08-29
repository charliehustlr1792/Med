"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtChecking = exports.userSignUp = exports.userLogIn = void 0;
const express_1 = require("express");
const client_1 = __importDefault(require("../client"));
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const route = (0, express_1.Router)();
var scode;
(function (scode) {
    scode[scode["Ok"] = 200] = "Ok";
    scode[scode["Cbad"] = 400] = "Cbad";
})(scode || (scode = {}));
const userSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    client_1.default.user.findMany({
        where: {
            OR: [
                {
                    email: req.body.email
                },
                {
                    uname: req.body.uname
                }
            ]
        }
    }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.length != 0) {
            data.forEach(e => {
                res.status(400);
                if (e.email === req.body.email) {
                    res.send({
                        msg: "emailExist"
                    });
                }
                else if (e.uname === req.body.uname) {
                    res.send({
                        msg: "userExist"
                    });
                }
            });
        }
        else {
            //no user present like that
            const hashed = yield bcrypt.hash(req.body.password, 10);
            client_1.default.user.create({
                data: {
                    email: req.body.email,
                    uname: req.body.uname,
                    password: hashed,
                }
            }).then(data => {
                res.status(200);
                res.send({
                    msg: "userCreated"
                });
            }).catch(e => {
                console.log("error : \n", e);
                res.status(500);
                res.send();
            });
        }
    })).catch(e => {
        console.log("error : \n", e);
        res.status(500);
        res.send();
    });
});
exports.userSignUp = userSignUp;
const userLogIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    client_1.default.user.findUnique({
        where: {
            email: req.body.email,
        }
    }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data == null) {
            res.status(400);
            res.send({ msg: "userNotFound" });
        }
        else {
            const comp = yield bcrypt.compare(req.body.password, data.password);
            if (!comp) {
                res.status(404).json({
                    msg: "incorrectPassword"
                });
            }
            try {
                jwt.sign({
                    userName: data.uname,
                    rand: Math.random()
                }, process.env.JWTSECRET, (err, token) => {
                    if (err) {
                        res.status(500);
                        res.send({
                            msg: "tokenGenerationFailed"
                        });
                        console.log(err);
                    }
                    else {
                        res.status(200);
                        res.send({
                            msg: "loginSuccesfull",
                            jwtToken: token
                        });
                    }
                });
            }
            catch (err) {
                console.log(err);
                res.status(500);
                res.send({
                    msg: "serverIssue"
                });
            }
        }
    })).catch(err => {
        console.log("error : \n", err);
        res.status(500);
        res.send();
    });
});
exports.userLogIn = userLogIn;
const jwtChecking = (req, res) => {
    res.status(200).json({
        msg: "jwt working fine"
    });
};
exports.jwtChecking = jwtChecking;
