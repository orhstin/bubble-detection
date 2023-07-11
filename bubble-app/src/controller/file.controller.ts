import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import uploadFile from "../middleware/upload";

const baseUrl = "http://localhost:8080";

const upload = async(req: Request, res: Response) => {
    try{
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!"});
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });

    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req?.file?.originalname}. ${err}`,
        });
    }
};

// const __basedir = path.resolve(path.dirname(""));
const getListFiles = (req: Request, res: Response) => {
    const directoryPath = path.join(__basedir + "/resources/static/assets/uploads/");

    fs.readdir(directoryPath, function (err, files) {
        if(err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }
        const fileInfos: Record<string, string>[]= [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: "http://localhost:8080/stream/" + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const getListResults = (req: Request, res: Response) => {
    const directoryPath = path.join(__basedir + "/resources/static/assets/results/")

    fs.readdir(directoryPath, function (err, files) {
        if(err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        const resultInfos: Record<string, string>[] = [];
        files.forEach((file) => {
            resultInfos.push({
                name: file,
                url: "http://localhost:8080/stream/" + file,
            })
        })
        res.status(200).send(resultInfos);
    })
}
const download = (req: Request, res: Response) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    res.download(path.join(directoryPath + fileName), fileName, (err) => {
        if(err) {
            res.status(500).send({
                message: "Could not download the file." + err,
            });
        }
    });
};

const stream = async(req: Request, res: Response) => {
    const fileName = req.params.name;
    var dir_path = __basedir + "/resources/static/assets/uploads/";
    if (fileName.split("_").pop() == "result.mp4"){
        dir_path = __basedir + "/resources/static/assets/results/";
    }
    if (fs.existsSync(path.join(dir_path, fileName))) {
        res.setHeader('Content-Type', 'video/mpeg4');
        res.setHeader('Content-Length', fs.statSync(path.join(dir_path,fileName)).size);
        
        const stream = fs.createReadStream(path.join(dir_path,fileName));
        stream.pipe(res);
    } else {
        res.status(404).json({ message: 'Video not found'});
    }
}

import { ChildProcess, exec } from "child_process";
import util from 'util';
import { rejects } from "assert";

const run_predict = (model:String, conf:number, source:String, project:String, temp:String): Promise<string> => {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/predict.py ${model} ${conf} ${source} ${project} ${temp}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stdout) {
                resolve(`Python script stderr: ${stdout}`);
                return;
            }
            if (stderr){
                reject(`Python script stderr: ${stderr}`);
            }
        });

    childProcess.on("close", (code) => {
        if (code !== 0) {
            reject(`Python script process exited with code ${code}`)
        }
    });
    });
}
const run_video_to_image = (video_file: String, filename: String) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/video_to_images.py ${video_file} ${filename}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
              }
              resolve(`Python script output: ${stdout}`);
        })
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`)
            }
        });
    })
} 
const run_image_to_video = (result_path: String, temp: String) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/images_to_video.py ${result_path} ${temp}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
              }
              console.log(`Python script output: ${stdout}`);
        })
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`)
            }
        });
    })
} 
const detect = async(req: Request, res: Response) => {
    var uploads_path = __basedir + "/resources/static/assets/uploads/";
    const model = "/Users/austin/Desktop/bubble-detection/yolov5/runs/detect/train/weights/best.pt";
    const conf = 0.25;
    const project = "../bubble-python/results"
    const files = fs.readdirSync(uploads_path);
    const result_names: Array<String> = [];
    console.log("Detect called");
    files.forEach((file) => {
        if (file !== '.DS_Store') {
          run_video_to_image(uploads_path + file, file).then((output) => {
            console.log(output);
            if (output.includes("completed")) {
              var source = "/Users/austin/Desktop/bubble-detection/bubble-python/images/" + file;
              const temp = file.split('.')[0] + '.' + file.split('.')[1] + '_result.mp4';
              result_names.push(temp);
              if (fs.existsSync(path.join(uploads_path, file))) {
                run_predict(model, conf, source, project, temp).then((output) => {
                  if (output.includes('Script completed')) {
                    console.log("Running predict")
                    const relevant_details = output.split('save_dir').pop();
                    const result_path = relevant_details?.split('\n')[0].split(' ')[1].replace(/['']/g, '');
                    if (result_path) {
                        console.log("Running image to video");
                      run_image_to_video(result_path, temp);
                    } else {
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
}

export {upload, getListFiles, download, stream, getListResults, detect};