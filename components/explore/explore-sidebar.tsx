"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationLinks = [
  {
    title: "Projects",
    href: "/explore/",
  },
  {
    title: "Startups",
    href: "/explore/startups",
  },
  {
    title: "Competitions",
    href: "/explore/competitions",
  },
];

export function ExploreSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4 mt-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-2 rounded-md hover:bg-muted transition-colors",
                pathname === link.href
                  ? "bg-muted font-medium"
                  : "text-muted-foreground"
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
