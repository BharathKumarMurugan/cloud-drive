"use server";

import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

/**
 * Create Account -> Flow
 * 1. user enters full name and email
 * 2. check if user already exists using the email
 * 3. send OTP to user's email
 * 4. this will send a secret key for creating a session.
 * 5. create a new user document if the user is a new user.
 * 6. return the user's accountId that will be used to complete the logic
 * 7. verify OTP and authenticate to login
 */

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal("email", [email])]);

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const api_sendEmailOtp = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const api_createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await api_sendEmailOtp({ email });
  if (!accountId) {
    throw new Error("Failed to send email OTP");
  }
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {
      fullName,
      email,
      avatar: avatarPlaceholderUrl,
      accountId,
    });
  }

  return parseStringify({ accountId });
};

export const api_verifyOtp = async ({ accountId, password }: { accountId: string; password: string }) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    // send the sesstion to cookies to store it
    (await cookies()).set("appwrite-session", session.secret, { path: "/", httpOnly: true, sameSite: "strict", secure: true });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const api_getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();
  const result = await account.get();

  const user = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal("accountId", result.$id)]);

  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
};

export const api_signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    // Delete the current session to log out the user
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to singout the user");
  } finally {
    redirect("/sign-in");
  }
};

export const api_signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await api_sendEmailOtp({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sing in the user");
  }
};
