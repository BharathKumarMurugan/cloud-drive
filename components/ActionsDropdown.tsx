"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api_renameFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

const ActionsDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [dropAction, setDropAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setDropAction(null);
    setName(file.name);
    // reset emails;
  };

  const handleAction = async () => {
    if(!dropAction) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () => api_renameFile({
         fileId: file.$id,
         name,
         extension: file.extension,
         path }),
        share: () => console.log("share"),  
        delete: () => console.log("delete"),
    }
    success = await actions[dropAction.value as keyof typeof actions]();
    if(success) closeAllModals();
    setIsLoading(false);
  };

  const renderDialog = () => {
    if (!dropAction) return null;
    const { value, label } = dropAction;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
          {value === "rename" && <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />}
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="animate-spin" />}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src="/assets/icons/dots.svg" alt="" width={34} height={34} className="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((action) => (
            <DropdownMenuItem
              key={action.value}
              className="shad-dropdown-item"
              onClick={() => {
                setDropAction(action);
                if (["rename", "share", "delete", "details"].includes(action.value)) {
                  setIsModalOpen(true);
                }
              }}
            >
              {action.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Image src={action.icon} alt={action.label} width={30} height={30} className="" />
                  {action.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                  <Image src={action.icon} alt={action.label} width={30} height={30} className="" />
                  {action.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialog()}
    </Dialog>
  );
};

export default ActionsDropdown;
