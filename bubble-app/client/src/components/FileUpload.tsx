import React, { useState, useEffect } from 'react';
import FileUploadService from "../services/FileUploadService";
import IFile from "../types/File";
import VideoPlayer from './VideoPlayer';

const FileUpload: React.FC = () => {
    const [currentFile, setCurrentFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [fileInfos, setFileInfos] = useState<Array<IFile>>([]);
    const [resultInfos, setResultInfos] = useState<Array<IFile>>([]);
    const [videoUrl, setVideoUrl] = useState<string>("");

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFiles = files as FileList;
        setCurrentFile(selectedFiles?.[0]);
        setProgress(0);
    };

    const detect = () => {
        FileUploadService.detect();
    }

    const upload = () => {
        setProgress(0);
        if (!currentFile) return;

        FileUploadService.upload(currentFile, (event: any) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then((response: any) => {
                setMessage(response.data.message);
                return FileUploadService.getFiles();
            })
            .then((files: any) => {
                delete files.data[0];
                console.log("Result Info" + resultInfos[0]);
                setFileInfos(files.data);
            })
            .catch((err: any) => {
                setProgress(0);

                if (err.response && err.response.data && err.response.data.message) {
                    setMessage(err.response.data.message);
                } else {
                    setMessage("Could not upload the File!");
                }
                setCurrentFile(undefined);
            })
        
        FileUploadService.getResults().then((results: any) => {
            setResultInfos(results.data);
        })
    }

    useEffect(() => {
        FileUploadService.getFiles().then((response: any) => {
            if(response.data[0].name == ".DS_Store"){
                delete response.data[0];
            }
            setFileInfos(response.data);})
        FileUploadService.getResults().then((response:any) => {
            if(response.data[0].name == ".DS_Store"){
                delete response.data[0];
            }
            console.log(response.data);
            setResultInfos(response.data);
        })
    }, []);
    return (
        <div>
            <div className="row w">
                <div className="col-8">
                    <label className="btn btn-default p-0">
                        <input type="file" onChange={selectFile} />
                    </label>
                </div>

                <div className="col-4">
                    <button
                        className="btn btn-success btn-sm"
                        disabled={!currentFile}
                        onClick={upload}
                    > Upload 
                    </button>
                </div>
            </div>

            {currentFile && (
                <div className="progress my-3">
                    <div
                        className="progress-bar progress-bar-info"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{width: progress + "%"}}
                    >
                        {progress}%
                    </div>
                </div>
            )}

            {message && (
                <div className="alert alert-secondary mt-3" role="alert">{message}</div>
            )}
            <div className="row">
                <div className="col-lg-5">
                    <div className="card mt-3">
                        <div className="card-header d-flex justify-content-center">Uploaded Video</div>
                        <ul className="list-group list-group-flush">
                            {fileInfos && fileInfos.map((file, index) => (
                                <li className="list-group-item" key={index}>
                                    <p className="d-flex justify-content-center">{file.url}</p>
                                    <div className="d-flex justify-content-center">
                                        <VideoPlayer videoUrl={file.url}></VideoPlayer>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-lg-2 d-flex align-self-center">
                    <button
                        className="btn btn-success btn-sm w-100"
                        onClick={detect}
                    > Detect
                    </button>
                </div>
                <div className="col-lg-5">
                    <div className="card mt-3">
                        <div className="d-flex card-header justify-content-center">Prediction Results</div>
                        <ul className="list-group list-group-flush">
                            {resultInfos && resultInfos.map((file, index) => (
                                <li className="list-group-item" key={index}>
                                    {file.url !== "http://localhost:8080/stream/.DS_Store" && (
                                        <div className="d-flex justify-content-center">
                                            <VideoPlayer videoUrl={file.url}></VideoPlayer></div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default FileUpload;