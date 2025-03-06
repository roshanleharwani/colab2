"use client";

import { LogOut, Trophy, Rocket, FolderGit2, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  {
    title: "Notifications",
    icon: Bell,
    href: "/explore/notifications",
  },
];
import { toast } from "react-hot-toast";
export function ExploreNav() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    const response = await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      localStorage.removeItem("user");
      toast.success("Logged out");
      router.push("/");
    } else {
      toast.error("Failed to logout");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-center border-b-[0.1px] py-5  border-gray-200 items-center text-xl font-semibold">
          Explore
        </div>
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
                className={`${
                  (
                    item.href === "/explore"
                      ? pathname === "/explore"
                      : pathname.startsWith(item.href)
                  )
                    ? "bg-black text-white"
                    : ""
                }`}
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
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              className="text-white rounded-md hover:text-white hover:scale-105 transition ease-in-out w-4/5 hover:bg-black/75 flex items-center gap-4  justify-center py-2 bg-black/80"
              onClick={() => {
                handleLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
