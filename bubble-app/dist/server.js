"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
global.__basedir = __dirname;
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use((0, cors_1.default)(corsOptions));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
const routes_1 = __importDefault(require("./src/routes"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/dist/resources/static/assets/uploads', express_1.default.static('uploads'));
(0, routes_1.default)(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
