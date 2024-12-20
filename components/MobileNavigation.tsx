"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { api_signOutUser } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  fullName: string;
  avatar: string;
  email: string;
  ownerId: string;
  accountId: string;
}

const MobileNavigation = ({ ownerId, accountId, fullName, avatar, email }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image src="/assets/icons/logo-full-brand.svg" alt="logo" width={120} height={52} className="h-auto" />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src="/assets/icons/menu.svg" alt="menu" width={30} height={30} className="" />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image src={avatar} alt="avatar" width={44} height={44} className="header-user-avatar" />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ name, icon, url }) => (
                <Link key={name} href={url} className="lg:w-full ">
                  <li className={cn("mobile-nav-item", pathname === url && "shad-active")}>
                    <Image src={icon} width={24} height={24} alt={name} className={cn("nav-icon", pathname === url && "nav-icon-active")} />
                    <p className="lg:block">{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="my-5 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader />
            <button type="submit" className="mobile-sign-out-button" onClick={async () => await api_signOutUser()}>
              <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} className="" />
              <p>Sign Out</p>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;