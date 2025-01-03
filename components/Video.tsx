import { Models } from "node-appwrite";
import React from "react";

const Video = ({ file }: { file: Models.Document }) => {
  return (
    <video width="640" height="480" controls preload="none" className="aspect-video">
      <source src={file.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
