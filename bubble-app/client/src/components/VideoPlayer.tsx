import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Set the video source to the streaming link
        // if(videoUrl.split("/").pop() == ".DS_Store"){
        //     console.log(videoUrl);
        // }

      // Load and play the video
        if (videoUrl.split(".").pop() == "mp4"){
            console.log(videoUrl);
            videoElement.src = videoUrl;
        }

        // videoElement.load();
        // videoElement.play();
    }

    return () => {
      // Cleanup when component is unmounted
      if (videoElement){
        videoElement.src="";
      }
    };
  }, [videoUrl]);

  return <video ref={videoRef} width="500px"controls />;
};

export default VideoPlayer;