import React from "react";
import FileUpload from "../components/FileUpload";
const Home = () => {
    return(
    <div className="container" style={{width:"1500px"}}>
      <div className="my-3">
        <h3>Bubble File Upload</h3>
      </div>
      <FileUpload />
    </div>
    );
};

export default Home;