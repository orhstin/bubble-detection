import dotenv from "dotenv";
import express, {Express, Request, Response} from "express";
import path from "path";
import cors from "cors";

const app: Express = express();

declare global {
    var __basedir: string;
}

global.__basedir = __dirname;

var corsOptions = {
    origin: "http://localhost:8081"
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

import routes from "./src/routes";

app.use(express.urlencoded({ extended: true}));
app.use('/dist/resources/static/assets/uploads', express.static('uploads'));
routes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});