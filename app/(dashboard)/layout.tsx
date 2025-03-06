import type React from "react";
import Link from "next/link";
import { ExploreNav } from "@/components/explore/explore-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Code2 } from "lucide-react";
import { UserDropdown } from "@/app/components/user-dropdown";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/explore" className="flex items-center gap-2 md:ml-10">
            <Code2 className="h-6 w-6" />
            <div className="font-bold">CoLab</div>
          </Link>

          <UserDropdown />
        </div>
      </header>

      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full -mt-4 ">
          <ExploreNav />
          <Toaster />
          <SidebarInset className="flex-1">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
