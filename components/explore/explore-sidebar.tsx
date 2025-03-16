"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Trophy,
  Rocket,
  FolderGit2,
  Bell,
  LogOut,
  LightbulbIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
const navigationLinks = [
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
    title: "Ideas",
    icon: LightbulbIcon,
    href: "/explore/ideas",
  },
  {
    title: "Join Requests",
    icon: Bell,
    href: "/explore/notifications",
  },
];

export function ExploreSidebar() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Explore</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-2 flex items-center gap-2 rounded-md hover:bg-muted transition-colors",
                pathname === link.href
                  ? "bg-muted font-medium"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          ))}
          <SheetTrigger
            className={`${
              theme === "light"
                ? "bg-black/80 hover:bg-black/75 text-white "
                : "bg-white/80 hover:bg-white/75 text-black"
            } rounded-md  hover:scale-105 transition ease-in-out w-4/5  flex items-center gap-4  justify-center py-2 `}
            onClick={() => {
              handleLogout();
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SheetTrigger>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
