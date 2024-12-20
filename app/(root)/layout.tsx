import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { api_getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await api_getCurrentUser();
  if(!currentUser) return redirect('/sign-in');

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <Sidebar {...currentUser} />
      {/* section */}
      <section className="flex h-full flex-1 flex-col">
        {/* mobile navigation */}
        <MobileNavigation  {...currentUser} />
        {/* header */}
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;