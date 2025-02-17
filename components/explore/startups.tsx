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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Startup {
  _id: string;
  name: string;
  tagline: string;
  industry: string;
  maxTeamSize: string;
  status: string;
  fundingStage: string;
  isRecruiting: boolean;
}

export function Startups() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/startup");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Handle different possible response structures
        let startupData: Startup[] = [];
        if (Array.isArray(data)) {
          startupData = data;
        } else if (data.startups && Array.isArray(data.startups)) {
          startupData = data.startups;
        } else if (typeof data === "object" && data !== null) {
          startupData = [data];
        }

        // Validate and format the data
        const validatedData = startupData.map((startup) => ({
          _id: startup._id || `temp-${Math.random()}`,
          name: startup.name || "Untitled Startup",
          tagline: startup.tagline || "",
          industry: startup.industry || "Uncategorised",
          maxTeamSize: startup.maxTeamSize || "Not specified",
          status: startup.isRecruiting ? "Hiring" : "Not Hiring",
          fundingStage: startup.fundingStage || "Not specified",
          isRecruiting: startup.isRecruiting || false,
        }));

        console.log("Validated Data:", validatedData);
        setStartups(validatedData);
      } catch (err) {
        console.error("Error details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch startups"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);

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
          {isLoading ? (
            <div className="text-center py-8">Loading startups...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !startups || startups.length === 0 ? (
            <div className="text-center py-8">No startups found.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {startups.map((startup, index) => (
                <motion.div
                  key={startup._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/explore/startups/${startup._id}`}>
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {startup.industry.toUpperCase()}
                          </Badge>
                          <Badge>{startup.status}</Badge>
                        </div>
                        <CardTitle className="mt-4">{startup.name}</CardTitle>
                        <CardDescription>{startup.tagline}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Team Size: {startup.maxTeamSize}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>Funding Stage: {startup.fundingStage}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2"></div>
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
