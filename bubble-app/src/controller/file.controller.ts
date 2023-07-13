import { Request, Response } from "express";
import fs, { rmSync } from "fs";
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
import { error } from "console";

const run_predict = (model:String, conf:number, source:String, project:String, temp:String): Promise<string> => {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`. ../bubble-python/bubble/bin/activate && python ../bubble-python/predict.py ${model} ${conf} ${source} ${project} ${temp}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing Predict Python script: ${error.message}`);
                return;
            }
            if (stdout) {
                resolve(`Predict Python script stderr: ${stdout}`);
                return;
            }
            if (stderr){
                reject(`Predict Python script stderr: ${stderr}`);
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
                console.error(`Error executing VTI Python script: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`VTI Python script stderr: ${stderr}`);
                return;
              }
              resolve(`VTI Python script output: ${stdout}`);
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
                console.error(`Error executing ITV Python script: ${error.message}`);
                return;
              }
              if (stderr) {
                reject(`ITV Python script stderr: ${stderr}`);
              }
              console.log(`ITV Python script output: ${stdout}`);
        })
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Python script process exited with code ${code}`)
            }
        });
    })
}

var temp_status = {'code': 0, 'message': ''};

const getStatus = (req: Request, res: Response) => {
    // console.log("Getting status..." + temp_status.code + temp_status.message);
    res.status(200).send(temp_status.message);
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
            temp_status['code'] = 200;
            temp_status['message'] = 'Running video_to_image';
          run_video_to_image(uploads_path + file, file).then((output) => {
            if (output.includes("completed")) {
              var source = "/Users/austin/Desktop/bubble-detection/bubble-python/images/" + file;
              const temp = file.split('.')[0] + '.' + file.split('.')[1] + '_result.mp4';
              result_names.push(temp);
              if (fs.existsSync(path.join(uploads_path, file))) {
                temp_status['code'] = 200; 
                temp_status['message'] = 'Running Predict';
                run_predict(model, conf, source, project, temp).then((output) => {
                  if (output.includes('Script completed')) {
                    const relevant_details = output.split('save_dir').pop();
                    const result_path = relevant_details?.split('\n')[0].split(' ')[1].replace(/['']/g, '');
                    if (result_path) {
                        temp_status['code'] = 200;
                        temp_status['message'] = 'Running ITV'
                      run_image_to_video(result_path, temp).then((response) =>{
                        console.log("ITV Response" + response);
                      }, (error) => {
                        if(error.includes("OpenCV: FFMPEG: fallback to use tag 0x7634706d/'mp4v'")){
                            temp_status['code'] = 201;
                            temp_status['message'] = 'Video uploaded';
                        }
                      })
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
}

const getTimestamps = async(req: Request, res: Response) => {
    const fileName = req.query.fileName;
    const time_path = "../bubble-python/results/" + fileName + "/labels"
    const timestamp_files = fs.readdirSync(time_path)
    const timestamp_arr : Array<string> = [];
    timestamp_files.forEach((timestamp) => {
        var temp = timestamp.split('-').pop()?.replace('.txt', '');
        if(typeof(temp) == 'string'){
            timestamp_arr.push(temp + '  ');
        }
    })
    res.status(200).send({
        fileName: fileName,
        length: timestamp_arr.length,
        timestamp_s: timestamp_arr.toString().replace(/,/g,''),
    })
}

export {upload, getListFiles, download, stream, getListResults, detect, getStatus, getTimestamps};