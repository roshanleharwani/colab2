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
import { Search, Users, Briefcase } from "lucide-react";
import Link from "next/link";
const startups = [
  {
    title: "EduTech Solutions",
    description:
      "Building an AI-powered platform to personalize learning experiences for students.",
    category: "Education",
    stage: "Seed",
    teamSize: "5",
    roles: ["Full Stack Developer", "ML Engineer", "UI/UX Designer"],
    status: "Hiring",
  },
  {
    title: "CampusConnect",
    description:
      "A social platform designed specifically for college students to network and collaborate.",
    category: "Social",
    stage: "Pre-seed",
    teamSize: "3",
    roles: ["Mobile Developer", "Backend Developer"],
    status: "Hiring",
  },
  {
    title: "GreenCampus",
    description:
      "Developing sustainable solutions for campus waste management and energy consumption.",
    category: "Sustainability",
    stage: "Idea",
    teamSize: "2",
    roles: ["IoT Developer", "Business Analyst"],
    status: "Seeking Co-founders",
  },
  // Add more startups as needed
];
import { useRouter } from "next/navigation";

export function Startups() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container flex items-center justify-between gap-4 py-4 px-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                className="w-[300px] pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              router.push("/explore/register/startup");
            }}
          >
            List Startup
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {startups.map((startup, index) => (
              <motion.div
                key={startup.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href="/explore/startups/id">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{startup.category}</Badge>
                        <Badge>{startup.status}</Badge>
                      </div>
                      <CardTitle className="mt-4">{startup.title}</CardTitle>
                      <CardDescription>{startup.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="grid gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Team Size: {startup.teamSize}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span>Stage: {startup.stage}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Open Roles</div>
                          <div className="flex flex-wrap gap-2">
                            {startup.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className="bg-primary/5"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
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
