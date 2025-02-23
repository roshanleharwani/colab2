"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Project {
  _id: string;
  name: string;
  description: string;
  category: string;
  teamSize: string;
  skills: string[];
  status: string;
}

export function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/project");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = Array.isArray(data) ? data : data.projects || [];
        setProjects(formattedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter controls for mobile
  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="ml">Machine Learning</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Add more filter options here */}
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] px-2">
      <header className="border-b">
        <div className="container py-4">
          {/* Desktop Search and Filters */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ExploreSidebar />
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="w-[300px] pl-8"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="ml">Machine Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => router.push("/explore/register/project")}>
              Create Project
            </Button>
          </div>

          {/* Mobile Search and Filters */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center gap-2">
              <ExploreSidebar />
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8 w-full"
                />
              </div>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterControls />
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                className="whitespace-nowrap"
                onClick={() => router.push("/explore/register/project")}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {projects.map((project, index) => (
                <motion.div
                  key={project?._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/explore/projects/${project?._id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <Badge variant="secondary">
                            {project?.category || "No Category"}
                          </Badge>
                          <Badge>{project?.status || "Unknown"}</Badge>
                        </div>
                        <CardTitle className="mt-4 line-clamp-1">
                          {project?.name || "Untitled Project"}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project?.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              Team Size: {project?.teamSize || "Not specified"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project?.skills?.map((skill, skillIndex) => (
                              <Badge
                                key={`${skill}-${skillIndex}`}
                                variant="outline"
                                className="bg-primary/5"
                              >
                                {skill}
                              </Badge>
                            )) || null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return <Projects />;
}
