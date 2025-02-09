"use client";

import { LogOut, Trophy, Rocket, FolderGit2, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
} from "@/components/ui/sidebar";
import Link from "next/link";

const menuItems = [
  {
    title: "Projects",
    icon: FolderGit2,
    href: "/explore",
  },
  {
    title: "Competitions",
    icon: Trophy,
    href: "/explore/competitions",
  },
  {
    title: "Startups",
    icon: Rocket,
    href: "/explore/startups",
  },
];

export function ExploreNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <form className="px-2">
          <SidebarInput placeholder="Search..." className="pl-8" />
          <Search className="absolute left-6 top-6 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.href === "/explore"
                    ? pathname === "/explore"
                    : pathname.startsWith(item.href)
                }
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
