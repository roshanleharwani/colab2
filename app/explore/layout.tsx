import type React from "react";
import { ExploreNav } from "@/components/explore/explore-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <ExploreNav />

        <Toaster />
        <SidebarInset className="flex-1   ">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
