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
import { Calendar, Search, Trophy, Users } from "lucide-react";
import Link from "next/link";
const competitions = [
  {
    title: "Campus Hackathon 2024",
    description:
      "24-hour hackathon focused on building innovative solutions for campus problems.",
    category: "Hackathon",
    date: "March 15-16, 2024",
    teamSize: "4",
    prizes: ["$1000", "$500", "$250"],
    status: "Upcoming",
  },
  {
    title: "AI Innovation Challenge",
    description:
      "Build AI-powered solutions to address real-world problems. Open to all students.",
    category: "AI Competition",
    date: "April 5-7, 2024",
    teamSize: "3",
    prizes: ["$2000", "$1000", "$500"],
    status: "Registration Open",
  },
  {
    title: "StartupTech Pitch Competition",
    description:
      "Present your startup idea to a panel of industry experts and win funding.",
    category: "Pitch Competition",
    date: "May 1, 2024",
    teamSize: "2-4",
    prizes: ["$5000", "$2500", "$1000"],
    status: "Coming Soon",
  },
  // Add more competitions as needed
];

export function Competitions() {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container flex items-center justify-between gap-4 py-4 px-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search competitions..."
                className="w-[300px] pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hackathon">Hackathons</SelectItem>
                <SelectItem value="ai">AI Competitions</SelectItem>
                <SelectItem value="pitch">Pitch Competitions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Register Team</Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {competitions.map((competition, index) => (
              <motion.div
                key={competition.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href="/explore/competitions/id">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {competition.category}
                        </Badge>
                        <Badge
                          variant={
                            competition.status === "Registration Open"
                              ? "default"
                              : "outline"
                          }
                        >
                          {competition.status}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">
                        {competition.title}
                      </CardTitle>
                      <CardDescription>
                        {competition.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="grid gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{competition.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Team Size: {competition.teamSize}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Trophy className="h-4 w-4" />
                            <span>Prizes</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {competition.prizes.map((prize, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-primary/5"
                              >
                                {prize}
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
