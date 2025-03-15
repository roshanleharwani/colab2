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
  Calendar,
  Search,
  Trophy,
  Users,
  IndianRupee,
  SlidersHorizontal,
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
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    Competition[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const { theme } = useTheme();
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register/competition");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let competitionsData: Competition[] = [];
        if (Array.isArray(data)) {
          competitionsData = data;
        } else if (data.competitions && Array.isArray(data.competitions)) {
          competitionsData = data.competitions;
        } else if (typeof data === "object" && data !== null) {
          competitionsData = [data];
        }

        const validatedData = competitionsData.map((competition) => ({
          _id: competition._id || `temp-${Math.random()}`,
          name: competition.name || "Untitled Competition",
          type: competition.type || "",
          startDate: competition.startDate || "",
          status: competition.status || "",
          prize: competition.prize || 0,
          maxTeamSize: competition.maxTeamSize || "Not specified",
          description: competition.description || "",
          endDate: competition.endDate || "",
        }));

        setCompetitions(validatedData);
        setFilteredCompetitions(validatedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch competitions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  // Filter competitions based on search query and type
  useEffect(() => {
    let filtered = [...competitions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (competition) =>
          competition.name.toLowerCase().includes(query) ||
          competition.description.toLowerCase().includes(query) ||
          competition.type.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (competition) => competition.type === selectedType
      );
    }

    setFilteredCompetitions(filtered);
  }, [searchQuery, selectedType, competitions]);

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hackathon">Hackathons</SelectItem>
            <SelectItem value="ideathon">Ideathons</SelectItem>
            <SelectItem value="coding">Coding Competitions</SelectItem>
            <SelectItem value="design">Design Challenges</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full m-2">
      <header className="border-b">
        <div className="container py-4">
          {/* Desktop Search and Filters */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search competitions..."
                  className="w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hackathon">Hackathons</SelectItem>
                  <SelectItem value="ideathon">Ideathons</SelectItem>
                  <SelectItem value="coding">Coding Competitions</SelectItem>
                  <SelectItem value="design">Design Challenges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => router.push("/explore/register/competition")}
            >
              Register Competition
            </Button>
          </div>

          {/* Mobile Search and Filters */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center gap-2">
              <ExploreSidebar />
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search competitions..."
                  className="pl-8 w-full sm:placeholder:text-sm"
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
              <Button
                className="whitespace-nowrap"
                onClick={() => router.push("/explore/register/competition")}
              >
                Register
              </Button>
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
          ) : !filteredCompetitions || filteredCompetitions.length === 0 ? (
            <div className="text-center py-8 flex justify-center items-center flex-col h-4/5 md:h-full">
              <Image
                src={
                  theme === "light"
                    ? "/competition.gif"
                    : "/Competition (1).gif"
                }
                alt="No competitions found"
                className="w-3/4 md:w-1/3 mb-4"
                width={300}
                height={300}
              />
              <p className="text-muted-foreground">
                {searchQuery || selectedType !== "all"
                  ? "No competitions match your search criteria."
                  : "No competitions found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompetitions.map((competition, index) => (
                <motion.div
                  key={competition._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/explore/competitions/${competition._id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
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
                        <CardTitle className="mt-4 line-clamp-1">
                          {competition.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {competition.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(
                                  competition.startDate
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                Team Size: {competition.maxTeamSize}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 flex-shrink-0" />
                              <span className="flex items-center gap-1">
                                Prize Pool: <IndianRupee className="h-4 w-4" />
                                {competition.prize}
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

export default function CompetitionsPage() {
  return <Competitions />;
}
