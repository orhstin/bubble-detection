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
exports.detect = exports.getListResults = exports.stream = exports.download = exports.getListFiles = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("../middleware/upload"));
const baseUrl = "http://localhost:8080";
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield (0, upload_1.default)(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    }
    catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.originalname}. ${err}`,
        });
    }
});
exports.upload = upload;
// const __basedir = path.resolve(path.dirname(""));
const getListFiles = (req, res) => {
    const directoryPath = path_1.default.join(__basedir + "/resources/static/assets/uploads/");
    fs_1.default.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }
        const fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: "http://localhost:8080/stream/" + file,
            });
        });
        res.status(200).send(fileInfos);
    });
};
exports.getListFiles = getListFiles;
const getListResults = (req, res) => {
    const directoryPath = path_1.default.join(__basedir + "/resources/static/assets/results/");
    fs_1.default.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }
        const resultInfos = [];
        files.forEach((file) => {
            resultInfos.push({
                name: file,
                url: "http://localhost:8080/stream/" + file,
            });
        });
        res.status(200).send(resultInfos);
    });
};
exports.getListResults = getListResults;
const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    res.download(path_1.default.join(directoryPath + fileName), fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file." + err,
            });
        }
    });
};
exports.download = download;
const stream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.name;
    var dir_path = __basedir + "/resources/static/assets/uploads/";
    if (fileName.split("_").pop() == "result.mp4") {
        dir_path = __basedir + "/resources/static/assets/results/";
    }
    if (fs_1.default.existsSync(path_1.default.join(dir_path, fileName))) {
        res.setHeader('Content-Type', 'video/mpeg4');
        res.setHeader('Content-Length', fs_1.default.statSync(path_1.default.join(dir_path, fileName)).size);
        const stream = fs_1.default.createReadStream(path_1.default.join(dir_path, fileName));
        stream.pipe(res);
    }
    else {
        res.status(404).json({ message: 'Video not found' });
    }
});
exports.stream = stream;
const child_process_1 = require("child_process");
const run_predict = (model, conf, source, project, temp) => {
    return new Promise((resolve, reject) => {
        const childProcess = (0, child_process_1.exec)(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/predict.py ${model} ${conf} ${source} ${project} ${temp}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stdout) {
                resolve(`Python script stderr: ${stdout}`);
                return;
            }
            if (stderr) {
                reject(`Python script stderr: ${stderr}`);
            }
        });
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`);
            }
        });
    });
};
const run_video_to_image = (video_file, filename) => {
    return new Promise((resolve, reject) => {
        const childProcess = (0, child_process_1.exec)(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/video_to_images.py ${video_file} ${filename}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }
            resolve(`Python script output: ${stdout}`);
        });
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`);
            }
        });
    });
};
const run_image_to_video = (result_path, temp) => {
    return new Promise((resolve, reject) => {
        const childProcess = (0, child_process_1.exec)(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/images_to_video.py ${result_path} ${temp}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }
            console.log(`Python script output: ${stdout}`);
        });
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`);
            }
        });
    });
};
const detect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var uploads_path = __basedir + "/resources/static/assets/uploads/";
    const model = "/Users/austin/Desktop/bubble-detection/yolov5/runs/detect/train/weights/best.pt";
    const conf = 0.25;
    const project = "../bubble-python/results";
    const files = fs_1.default.readdirSync(uploads_path);
    const result_names = [];
    console.log("Detect called");
    files.forEach((file) => {
        if (file !== '.DS_Store') {
            run_video_to_image(uploads_path + file, file).then((output) => {
                console.log(output);
                if (output.includes("completed")) {
                    var source = "/Users/austin/Desktop/bubble-detection/bubble-python/images/" + file;
                    const temp = file.split('.')[0] + '.' + file.split('.')[1] + '_result.mp4';
                    result_names.push(temp);
                    if (fs_1.default.existsSync(path_1.default.join(uploads_path, file))) {
                        run_predict(model, conf, source, project, temp).then((output) => {
                            if (output.includes('Script completed')) {
                                console.log("Running predict");
                                const relevant_details = output.split('save_dir').pop();
                                const result_path = relevant_details === null || relevant_details === void 0 ? void 0 : relevant_details.split('\n')[0].split(' ')[1].replace(/['']/g, '');
                                if (result_path) {
                                    console.log("Running image to video");
                                    run_image_to_video(result_path, temp);
                                }
                                else {
                                    console.log("Result_Path does not exist");
                                }
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                }
            });
        }
    });
    var results_path = __basedir + "/resources/static/assets/results/";
});
exports.detect = detect;
