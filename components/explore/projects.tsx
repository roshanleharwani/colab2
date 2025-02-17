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
import { Users, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/project");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug log

        // Check if data is an array and has the expected structure
        const formattedData = Array.isArray(data) ? data : data.projects || [];
        console.log("Formatted Data:", formattedData); // Debug log

        setProjects(formattedData);
      } catch (err) {
        console.error("Error details:", err); // Debug log
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container flex items-center justify-between gap-4 py-4 px-2">
          <div className="flex items-center gap-4">
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
          <Button
            onClick={() => {
              router.push("/explore/register/project");
            }}
          >
            Create Project
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-2">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project, index) => {
                // Debug log for each project

                return (
                  <motion.div
                    key={project?._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/explore/projects/${project?._id}`}>
                      <Card className="h-full w-full">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {project?.category || "No Category"}
                            </Badge>
                            <Badge>{project?.status || "Unknown"}</Badge>
                          </div>
                          <CardTitle className="mt-4">
                            {project?.name || "Untitled Project"}
                          </CardTitle>
                          <CardDescription>
                            {project?.description || "No description available"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                Team Size:{" "}
                                {project?.teamSize || "Not specified"}
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
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
