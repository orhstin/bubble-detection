import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-type": "application/json",
    }
})
const upload = (file: File, onUploadProgress: any): Promise<any> => {
    let formData = new FormData();

    formData.append("file", file);
    return http.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },

        onUploadProgress,
    });
};

const getFiles = () : Promise<any> => {
    return http.get("/files");
};

const stream = (fileName: any) : Promise<any> => {
    return http.get(`/stream/${fileName}`);
}

const getResults = () : Promise<any> => {
    return http.get("/results");
}

const detect = () : Promise<any> => {
    return http.get("/detect");
}

const getStatus = () : Promise<any> => {
    return http.get("/getStatus");
}

const getTimestamps = (fileName: any) : Promise<any> => {
    const params = {
        fileName: fileName,
    }
    return http.get("/getTimestamps", {params});
}
export const FileUploadService = {
    upload,
    getFiles,
    stream,
    getResults,
    detect,
    getStatus,
    getTimestamps,
}

export default FileUploadService;