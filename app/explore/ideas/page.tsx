"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";
import {
  Search,
  ThumbsUp,
  MessageSquare,
  Timer,
  Lightbulb,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const formSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  authorName: z.string().min(2, "Name is required"),
  authorRegNumber: z.string().min(2, "Registration number is required"),
});

interface Idea {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    regNumber: string;
    avatar?: string;
  };
  tags: string[];
  likes: number;
  comments: Array<{
    author: {
      name: string;
      regNumber: string;
      avatar?: string;
    };
    content: string;
    createdAt: Date;
  }>;
  status: "open" | "in-progress" | "implemented";
  createdAt: Date;
}

function IdeaCard({ idea }: { idea: Idea }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{idea.category}</Badge>
          <Badge
            variant={
              idea.status === "open"
                ? "default"
                : idea.status === "in-progress"
                ? "secondary"
                : "outline"
            }
          >
            {idea.status}
          </Badge>
        </div>
        <CardTitle className="mt-4 line-clamp-2">{idea.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Timer className="h-4 w-4" />
          {new Date(idea.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {idea.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-primary/5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsLiked(!isLiked)}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-primary" : ""}`} />
            <span>{idea.likes + (isLiked ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{idea.comments.length}</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          by {idea.author.name}
        </div>
      </CardFooter>
    </Card>
  );
}

function PostIdeaDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      authorName: "",
      authorRegNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          tags: values.tags
            ? values.tags.split(",").map((tag) => tag.trim())
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post idea");
      }

      toast({
        title: "Success!",
        description: "Your idea has been posted.",
      });
      setIsOpen(false);
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your idea. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Lightbulb className="mr-2 h-4 w-4" />
          Share Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share Your Idea</DialogTitle>
          <DialogDescription>
            Share your innovative idea with the community. Be clear and concise
            in your description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your idea title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your idea in detail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tags, comma separated"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>e.g., AI, Mobile, Web</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorRegNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your reg. number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Post Idea</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (category !== "all") params.append("category", category);
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);

        const response = await fetch(`/api/ideas?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIdeas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ideas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, [category, sort, search]);

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <header className="border-b">
        <div className="container py-4">
          {/* Desktop Search and Filters */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ExploreSidebar />
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  className="w-[300px] pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PostIdeaDialog />
          </div>

          {/* Mobile Search and Filters */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center gap-2">
              <ExploreSidebar />
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  className="pl-8 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
              <PostIdeaDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {isLoading ? (
            <div className="text-center py-8">Loading ideas...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : !ideas || ideas.length === 0 ? (
            <div className="text-center py-8">No ideas found.</div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {ideas.map((idea) => (
                  <motion.div
                    key={idea._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <IdeaCard idea={idea} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function IdeasPage() {
  return <Ideas />;
}
