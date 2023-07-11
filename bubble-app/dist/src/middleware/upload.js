"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util = __importStar(require("util"));
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const maxSize = 50 * 1024 * 1024;
// const __basedir = path.resolve(path.dirname(""));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__basedir + "/resources/static/assets/uploads"));
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});
const uploadFile = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");
const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
