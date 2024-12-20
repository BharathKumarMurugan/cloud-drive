"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";

interface FileUploaderProps {
  classNames?: string;
  ownerId: string;
  accountId: string;
}

const FileUploader = ({ classNames, ownerId, accountId }: FileUploaderProps) => {
  const [files, setFiles] = useState<File>([]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  }

  return (
    <div {...getRootProps()} className="cursor-pointer ">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", classNames)}>
        <Image src="/assets/icons/upload.svg" alt="uploader" width={24} height={24} className="" />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const {type, extension} = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                <div className="flex items-center gap-3">
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />
                  <div className="preview-item-name">{file.name}
                    <Image src="/assets/icons/file-loader.gif" alt="file-loader" width={80} height={26} className="" /> 
                  </div>
                </div>
                <Image src="/assets/icons/remove.svg" alt="remove" width={24} height={24} className="" onClick={(e) => handleRemoveFile(e, file.name)} />
              </li>
            )
          })}
      </ul>)}
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  );
  return <div>FileUploader</div>;
};

export default FileUploader;
