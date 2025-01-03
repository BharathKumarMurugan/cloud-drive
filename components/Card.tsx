"use client";
import Link from "next/link";
import { Models } from "node-appwrite";
import React, { useState } from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import ActionsDropdown from "./ActionsDropdown";
import FormatedDateTime from "./FormatedDateTime";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Video from "./Video";

const Card = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("inside handleClick");
    if (file.extension === "mp4") {
      setIsModalOpen(true);
      console.log("inside file extension");
    }
  };
  return (
    <>
      <Link href={file.url} target="_blank" className="file-card" onClick={handleClick}>
        <div className="flex justify-between">
          <Thumbnail type={file.type} extension={file.extension} url={file.url} className="!size-20" imageClassName="!size-11" />
          <div className="flex flex-col items-end justify-between" onClick={(e) => e.stopPropagation()}>
            <ActionsDropdown file={file} />
            <p className="body-1">{convertFileSize(file.size)}</p>
          </div>
        </div>

        <div className="file-card-details">
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
          <FormatedDateTime date={file.$createdAt} className="body-2 text-light-100" />
          <p className="caption line-clamp-1 text-light-200">By: {file.owner.fullName}</p>
        </div>
      </Link>

      {/* Modal for Video player */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{file.name}</DialogTitle>
          </DialogHeader>
          <Video file={file} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Card;
