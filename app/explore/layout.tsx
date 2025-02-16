import type React from "react";
import { ExploreNav } from "@/components/explore/explore-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <ExploreNav />
        <SidebarInset className="flex-1 ">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
