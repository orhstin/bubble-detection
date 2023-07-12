import express, { Router } from "express";

import {upload, getListFiles, download, stream, getListResults, detect, 
    getStatus,
    getTimestamps} from "../controller/file.controller";

const router: Router = express.Router();

const routes = (app: express.Application) => {
    router.post("/upload", upload);
    router.get("/stream/:name", stream);
    router.get("/files", getListFiles);
    router.get("/results", getListResults);
    router.get("files/:name", download);
    router.get("/detect", detect);
    router.get("/getStatus", getStatus);
    router.get("/getTimestamps", getTimestamps)


    app.use(router);
};

export = routes;