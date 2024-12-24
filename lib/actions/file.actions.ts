"use server";

import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { api_getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const api_uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), inputFile);

    // uploaded file metadata
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    // store file metadata in database
    const newFile = await databases
      .createDocument(appwriteConfig.databaseId, appwriteConfig.filesCollectionId, ID.unique(), fileDocument)
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to store the file");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (currentUser: Models.Document) => {
  const queries = [Query.or([Query.equal("owner", [currentUser.$id]), Query.contains("users", [currentUser.email])])];

  // todo: search, sort, limit, etc
  return queries;
};

export const api_getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await api_getCurrentUser();
    if (!currentUser) {
      throw new Error("User not found");
    }
    const queries = createQueries(currentUser);

    console.log({ currentUser, queries });

    const files = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.filesCollectionId, queries);

    console.log({ files }); 
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const api_renameFile = async ({fileId, name, extension, path}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.filesCollectionId, fileId, {
      name: newName,
    });
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
}