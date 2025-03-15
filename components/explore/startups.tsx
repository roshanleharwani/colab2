"use client";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Search,
  Users,
  Briefcase,
  SlidersHorizontal,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";

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
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/startup");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let startupData: Startup[] = [];
        if (Array.isArray(data)) {
          startupData = data;
        } else if (data.startups && Array.isArray(data.startups)) {
          startupData = data.startups;
        } else if (typeof data === "object" && data !== null) {
          startupData = [data];
        }

        const validatedData = startupData.map((startup) => ({
          _id: startup._id || `temp-${Math.random()}`,
          name: startup.name || "Untitled Startup",
          tagline: startup.tagline || "",
          industry: startup.industry || "Uncategorized",
          maxTeamSize: startup.maxTeamSize || "Not specified",
          status: startup.isRecruiting ? "Hiring" : "Not Hiring",
          fundingStage: startup.fundingStage || "Not specified",
          isRecruiting: startup.isRecruiting || false,
        }));

        setStartups(validatedData);
        setFilteredStartups(validatedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch startups"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // Filter startups based on search query and industry
  useEffect(() => {
    let filtered = [...startups];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (startup) =>
          startup.name.toLowerCase().includes(query) ||
          startup.tagline.toLowerCase().includes(query) ||
          startup.industry.toLowerCase().includes(query)
      );
    }

    // Apply industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(
        (startup) => startup.industry === selectedIndustry
      );
    }

    setFilteredStartups(filtered);
  }, [searchQuery, selectedIndustry, startups]);

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Industry</label>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="health">Healthcare</SelectItem>
            <SelectItem value="edu">Education</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="ecommerce">E-Commerce</SelectItem>
            <SelectItem value="sustainability">Sustainability</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const { theme } = useTheme();
  return (
    <div className="flex flex-col h-full m-2">
      <header className="border-b">
        <div className="container py-4">
          {/* Desktop Search and Filters */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex  items-center  gap-2 my-2 w-full">
                <Rocket size={32} />
                <h1 className="text-2xl md:text-3xl font-bold w-full">
                  Startups
                </h1>
                <Button
                  onClick={() => router.push("/explore/register/startup")}
                >
                  List Startup
                </Button>
              </div>
              <div className="flex  sm:flex-row gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search startups..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="edu">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="ecommerce">E-Commerce</SelectItem>
                    <SelectItem value="sustainability">
                      Sustainability
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Mobile Search and Filters */}
          <div className="md:hidden space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex  items-center  gap-2 my-2">
                <ExploreSidebar />
                <Rocket size={40} />
                <h1 className="text-2xl md:text-3xl font-bold w-full">
                  Startups
                </h1>
                <Button
                  className="whitespace-nowrap"
                  onClick={() => router.push("/explore/register/startup")}
                >
                  List
                </Button>
              </div>
              <div className="flex  sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search startups..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container py-6 h-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !filteredStartups || filteredStartups.length === 0 ? (
            <div className="text-center py-8 flex justify-center items-center flex-col h-4/5 md:h-full">
              <Image
                src={theme === "light" ? "/startup.gif" : "/Startup (1).gif"}
                alt="No startups found"
                className="w-3/4 md:w-1/3 mb-4"
                width={300}
                height={300}
              />
              <p className="text-muted-foreground">
                {searchQuery || selectedIndustry !== "all"
                  ? "No startups match your search criteria."
                  : "No startups found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStartups.map((startup, index) => (
                <motion.div
                  key={startup._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/explore/startups/${startup._id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <Badge variant="secondary">
                            {startup.industry.toUpperCase()}
                          </Badge>
                          <Badge>{startup.status}</Badge>
                        </div>
                        <CardTitle className="mt-4 line-clamp-1">
                          {startup.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {startup.tagline}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                Team Size: {startup.maxTeamSize}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                Funding Stage: {startup.fundingStage}
                              </span>
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

export default function StartupsPage() {
  return <Startups />;
}
