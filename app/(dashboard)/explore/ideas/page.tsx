/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Plus,
  Send,
  LightbulbIcon,
  SlidersHorizontal,
} from "lucide-react";
import { IdeaForm } from "@/components/idea-form";
import { IdeaModal } from "@/components/idea-modal";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";
import Image from "next/image";
import { useTheme } from "next-themes";

// Get current user from localStorage
const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    if (!userId || !userName) {
      return null;
    }

    return {
      id: userId,
      name: userName,
      avatar: "/placeholder.svg", // Default avatar
    };
  }
  return null;
};

interface Idea {
  _id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: Array<{
    userId: string;
    createdAt: string;
  }>;
  comments: Array<{
    _id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }>;
  tags: string[];
}

export default function IdeasPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);

  // Get current user on component mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Fetch ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/ideas`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch ideas");
        }

        const data = await response.json();

        // Ensure each idea has the required fields
        const formattedData = data.map((idea: any) => ({
          ...idea,
          likes: idea.likes || [],
          comments: idea.comments || [],
          tags: idea.tags || [],
        }));

        setIdeas(formattedData);

        // Initialize user likes if user is logged in
        if (currentUser) {
          const likes: Record<string, boolean> = {};
          formattedData.forEach((idea: Idea) => {
            likes[idea._id] = idea.likes.some(
              (like) => like.userId === currentUser.id
            );
          });
          setUserLikes(likes);
        }
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setError("Failed to load ideas. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, [currentUser]);

  // Filter and sort ideas based on search query and sort criteria
  const filteredIdeas = ideas
    .filter((idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "latest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "popular") {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });

  // Handle like/unlike
  const handleLike = async (ideaId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to like ideas",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${ideaId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      // Update local state
      setUserLikes((prev) => ({
        ...prev,
        [ideaId]: !prev[ideaId],
      }));

      // Update idea likes count in the ideas list
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => {
          if (idea._id === ideaId) {
            const isLiked = userLikes[ideaId];
            const updatedLikes = isLiked
              ? idea.likes.filter((like) => like.userId !== currentUser.id)
              : [
                  ...idea.likes,
                  {
                    userId: currentUser.id,
                    createdAt: new Date().toISOString(),
                  },
                ];

            return { ...idea, likes: updatedLikes };
          }
          return idea;
        })
      );

      // Update selected idea if it's the one being liked
      if (selectedIdea && selectedIdea._id === ideaId) {
        const isLiked = userLikes[ideaId];
        const updatedLikes = isLiked
          ? selectedIdea.likes.filter((like) => like.userId !== currentUser.id)
          : [
              ...selectedIdea.likes,
              { userId: currentUser.id, createdAt: new Date().toISOString() },
            ];

        setSelectedIdea({ ...selectedIdea, likes: updatedLikes });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to like/unlike. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle adding a comment
  const handleAddComment = async (ideaId: string, content: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const { comment } = await response.json();

      // Update selected idea with the new comment
      if (selectedIdea && selectedIdea._id === ideaId) {
        setSelectedIdea({
          ...selectedIdea,
          comments: [...selectedIdea.comments, comment],
        });
      }

      // Update the idea in the ideas list
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => {
          if (idea._id === ideaId) {
            return {
              ...idea,
              comments: [...idea.comments, comment],
            };
          }
          return idea;
        })
      );

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle idea creation
  const handleIdeaCreated = (newIdea: Idea) => {
    // Ensure the new idea has all required fields for display
    const formattedIdea = {
      ...newIdea,
      likes: newIdea.likes || [],
      comments: newIdea.comments || [],
      tags: newIdea.tags || [],
    };

    setIdeas((prevIdeas) => [formattedIdea, ...prevIdeas]);
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Your idea has been posted successfully!",
    });
  };

  // Add a check for user login before opening the form
  const handleOpenForm = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to post ideas",
        variant: "destructive",
      });
      return;
    }
    setIsFormOpen(true);
  };

  return (
    <div className="container py-6 md:px-2 ">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex  md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex  items-center  gap-2 my-2">
              <ExploreSidebar />
              <LightbulbIcon />
              <h1 className="text-3xl font-bold">Ideas</h1>
            </div>
          </div>

          <Button onClick={handleOpenForm}>
            <Plus className="mr-2 h-4 w-4" /> Post Idea
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex  sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium">Sort By</h4>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={sortBy === "latest" ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setSortBy("latest")}
                    >
                      Latest
                    </Button>
                    <Button
                      variant={sortBy === "popular" ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setSortBy("popular")}
                    >
                      Most Popular
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Ideas grid */}
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
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-8 flex justify-center items-center flex-col h-4/5 md:h-full">
            <Image
              src={theme === "light" ? "/idea-dark.gif" : "/idea.gif"}
              alt="No Projects found"
              className="w-3/4 md:w-1/3 mb-4"
              width={300}
              height={300}
            />
            <p className="text-muted-foreground">
              No Idea Found for your search query{" "}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredIdeas.map((idea) => (
                <motion.div
                  key={idea._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedIdea(idea);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {idea.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {idea.author.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(new Date(idea.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <CardTitle className="mt-2">{idea.title}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {idea.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {idea.tags &&
                          idea.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-primary/5"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(idea._id);
                        }}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 ${
                            userLikes[idea._id]
                              ? "fill-primary text-primary"
                              : ""
                          }`}
                        />
                        <span>{idea.likes.length}</span>
                      </Button>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{idea.comments.length}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80"
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Comments</h4>
                              <p className="text-sm text-muted-foreground">
                                {idea.comments.length === 0
                                  ? "No comments yet. Be the first to comment!"
                                  : `${idea.comments.length} comment${
                                      idea.comments.length !== 1 ? "s" : ""
                                    }`}
                              </p>
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                              {idea.comments.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                  No comments yet
                                </p>
                              ) : (
                                idea.comments.map((comment) => (
                                  <div key={comment._id} className="flex gap-2">
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                      <AvatarFallback>
                                        {comment.author.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                          {comment.author.name}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                          {format(
                                            new Date(comment.createdAt),
                                            "MMM d, h:mm a"
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-sm">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            <Separator />

                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarFallback>
                                  {currentUser?.name?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <form
                                className="flex-1 flex gap-2"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!currentUser) {
                                    toast({
                                      title: "Authentication required",
                                      description: "Please log in to comment",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  const form = e.currentTarget;
                                  const formData = new FormData(form);
                                  const content = formData.get(
                                    "content"
                                  ) as string;

                                  if (content.trim()) {
                                    handleAddComment(idea._id, content);
                                    form.reset();
                                  }
                                }}
                              >
                                <Input
                                  name="content"
                                  placeholder={
                                    currentUser
                                      ? "Add a comment..."
                                      : "Please log in to comment"
                                  }
                                  className="flex-1 h-8"
                                  disabled={!currentUser}
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={!currentUser}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </form>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Idea Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Post a New Idea</DialogTitle>
            <DialogDescription>
              Share your innovative idea with the community. Be clear and
              concise.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <IdeaForm
              currentUser={currentUser}
              onIdeaCreated={handleIdeaCreated}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Idea Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedIdea && (
            <IdeaModal
              idea={selectedIdea}
              currentUser={currentUser}
              isLiked={
                currentUser ? userLikes[selectedIdea._id] || false : false
              }
              onLike={() => handleLike(selectedIdea._id)}
              onAddComment={(content) =>
                handleAddComment(selectedIdea._id, content)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
