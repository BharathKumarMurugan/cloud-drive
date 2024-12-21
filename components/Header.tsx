import Image from "next/image";
import React from "react";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { api_signOutUser } from "@/lib/actions/user.actions";

interface HeaderProps {
  userId: string;
  accountId: string;
}

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} classNames="" />

        <form
          action={async () => {
            "use server";
            await api_signOutUser();
          }}
        >
          <button type="submit" className="sign-out-button">
            <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} className="w-6" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
