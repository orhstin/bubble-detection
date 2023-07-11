import * as util from "util";
import multer from "multer";
import { Request } from "express";
import * as path from "path";

const maxSize = 50 * 1024 * 1024;

// const __basedir = path.resolve(path.dirname(""));

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, path.join(__basedir + "/resources/static/assets/uploads"));
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
})

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);
export = uploadFileMiddleware;