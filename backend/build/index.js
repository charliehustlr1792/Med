"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/auth/", authRoutes_1.default);
app.get("/test/", (req, res) => {
    res.status(200);
    res.send({
        msg: " hello from server"
    });
});
app.listen(process.env.PORT, () => {
    console.log(`application running on port ${process.env.PORT}`);
});
