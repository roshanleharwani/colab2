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
import { Calendar, Search, Trophy, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// const competitions = [
//   {
//     title: "Campus Hackathon 2024",
//     description:
//       "24-hour hackathon focused on building innovative solutions for campus problems.",
//     category: "Hackathon",
//     date: "March 15-16, 2024",
//     teamSize: "4",
//     prizes: ["$1000", "$500", "$250"],
//     status: "Upcoming",
//   },
//   {
//     title: "AI Innovation Challenge",
//     description:
//       "Build AI-powered solutions to address real-world problems. Open to all students.",
//     category: "AI Competition",
//     date: "April 5-7, 2024",
//     teamSize: "3",
//     prizes: ["$2000", "$1000", "$500"],
//     status: "Registration Open",
//   },
//   {
//     title: "StartupTech Pitch Competition",
//     description:
//       "Present your startup idea to a panel of industry experts and win funding.",
//     category: "Pitch Competition",
//     date: "May 1, 2024",
//     teamSize: "2-4",
//     prizes: ["$5000", "$2500", "$1000"],
//     status: "Coming Soon",
//   },
// Add more competitions as needed
// ];

interface Competition {
  _id: string;
  description: string;
  name: string;
  type: string;
  maxTeamSize: string;
  startDate: string;
  status: string;
  prize: number;
  endDate: string;
}

export function Competitions() {
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/competition");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Handle different possible response structures
        let competitionsData: Competition[] = [];
        if (Array.isArray(data)) {
          competitionsData = data;
        } else if (data.startups && Array.isArray(data.startups)) {
          competitionsData = data.startups;
        } else if (typeof data === "object" && data !== null) {
          competitionsData = [data];
        }

        // Validate and format the data
        const validatedData = competitionsData.map((competition) => ({
          _id: competition._id || `temp-${Math.random()}`,
          name: competition.name || "Untitled Startup",
          type: competition.type || "",
          startDate: competition.startDate || "",
          status: competition.status || "",
          prize: competition.prize || 0,
          maxTeamSize: competition.maxTeamSize || "Not specified",
          description: competition.description || "",
          endDate: competition.endDate || "",
        }));

        console.log("Validated Data:", validatedData);
        setCompetition(validatedData);
      } catch (err) {
        console.error("Error details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch startups"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetition();
  }, []);

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
          <Button
            onClick={() => {
              router.push("/explore/register/competition");
            }}
          >
            Register Competition
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-2">
          {isLoading ? (
            <div className="text-center py-8">Loading Events...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !competition || competition.length === 0 ? (
            <div className="text-center py-8">No Events found.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {competition.map((competition, index) => (
                <motion.div
                  key={competition.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href="/explore/competitions/id">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{competition.type}</Badge>
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
                          {competition.name}
                        </CardTitle>
                        <CardDescription>
                          {competition.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              Start Date:
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(competition.startDate)
                                  .toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(",", "")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              End Date:
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(competition.endDate)
                                  .toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(",", "")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Team Size: {competition.maxTeamSize}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Trophy className="h-4 w-4" />
                              <span>Prize Pool: </span>
                              <div className="flex gap-1 items-center">
                                <IndianRupee size={16} />
                                {competition.prize}
                              </div>
                            </div>
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
