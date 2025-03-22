"use client";
import { useTheme } from "next-themes";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Code2 } from "lucide-react";
import { MoonIcon, Sun } from "lucide-react";
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Projects",
    href: "/explore/",
    description:
      "Browse and join exciting student projects across various domains.",
  },
  {
    title: "Startups",
    href: "/explore/startups",
    description: "Discover and be part of innovative student-led startups.",
  },
  {
    title: "Competitions",
    href: "/explore/competitions",
    description:
      "Participate in hackathons, coding contests, and other competitions.",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="mb-5">Explore</SheetTitle>
            <nav className="flex flex-col gap-4">
              <Link
                href="/explore"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-1 text-lg"
              >
                Projects
              </Link>
              <Link
                href="/explore/startups"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-1 text-lg"
              >
                Startups
              </Link>
              <Link
                href="/explore/competitions"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-1 text-lg"
              >
                Competitions
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-1 text-lg"
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Code2 className="h-8 w-8" />
              <span className="font-bold inline-block">CoLab</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button variant="ghost" asChild className="md:hidden">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button
              className="rounded-full "
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={5} />
                </>
              ) : (
                <>
                  <MoonIcon size={5} />
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
