"use client";

import {
  LogOut,
  Trophy,
  Rocket,
  FolderGit2,
  Bell,
  LightbulbIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
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
    title: "ideas",
    icon: LightbulbIcon,
    href: "/explore/ideas",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/explore/notifications",
  },
];
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  return (
    <Sidebar className="md:pt-20 px-3">
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
              className={`${
                theme === "light"
                  ? "bg-black/80 hover:bg-black/75 text-white hover:text-white "
                  : "bg-white/80 hover:bg-white/75 text-black hover:text-black"
              } rounded-md  hover:scale-105 transition ease-in-out w-4/5  flex items-center gap-4  justify-center py-2 `}
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
