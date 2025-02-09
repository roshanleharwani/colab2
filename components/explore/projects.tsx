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
const projects = [
  {
    title: "AI-Powered Study Assistant",
    description:
      "Building an AI assistant to help students organize their study materials and create personalized learning paths.",
    category: "Machine Learning",
    teamSize: "3-4",
    skills: ["Python", "Machine Learning", "NLP", "React"],
    status: "Active",
  },
  {
    title: "Campus Navigation App",
    description:
      "Developing a mobile app to help students navigate the campus, find classrooms, and get real-time updates about facilities.",
    category: "Mobile Development",
    teamSize: "2-3",
    skills: ["React Native", "Node.js", "MongoDB"],
    status: "Active",
  },
  {
    title: "Student Marketplace",
    description:
      "Creating a platform for students to buy, sell, and exchange academic materials and other items within the campus community.",
    category: "Web Development",
    teamSize: "4-5",
    skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    status: "Active",
  },
  // Add more projects as needed
];

export function Projects() {
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
          <Button>Create Project</Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href="/explore/projects/id">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{project.category}</Badge>
                        <Badge>{project.status}</Badge>
                      </div>
                      <CardTitle className="mt-4">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Team Size: {project.teamSize}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="bg-primary/5"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
