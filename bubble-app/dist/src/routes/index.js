"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controller/file.controller");
const router = express_1.default.Router();
const routes = (app) => {
    router.post("/upload", file_controller_1.upload);
    router.get("/stream/:name", file_controller_1.stream);
    router.get("/files", file_controller_1.getListFiles);
    router.get("/results", file_controller_1.getListResults);
    router.get("files/:name", file_controller_1.download);
    router.get("/detect", file_controller_1.detect);
    app.use(router);
};
module.exports = routes;
