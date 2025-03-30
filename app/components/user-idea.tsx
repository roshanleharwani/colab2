/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  MessageSquare,
  Calendar,
  Edit,
  Trash,
  Loader2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

const editIdeaSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string().optional(),
});

interface UserIdeasProps {
  userId: string;
}

export function UserIdeas({ userId }: UserIdeasProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<z.infer<typeof editIdeaSchema>>({
    resolver: zodResolver(editIdeaSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });

  // Fetch user's ideas
  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API with the user ID
        const response = await fetch(`/api/ideas?authorId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
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
      } catch (error) {
        console.error("Error fetching user ideas:", error);
        setError("Failed to load your ideas. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserIdeas();
    }
  }, [userId]);

  // Set form values when editing an idea
  useEffect(() => {
    if (selectedIdea && isEditDialogOpen) {
      form.reset({
        title: selectedIdea.title,
        description: selectedIdea.description,
        tags: selectedIdea.tags.join(", "),
      });
      setTags(selectedIdea.tags);
    }
  }, [selectedIdea, isEditDialogOpen, form]);

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedIdea) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ideas/${selectedIdea._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete idea");
      }

      // Remove the deleted idea from the list
      setIdeas(ideas.filter((idea) => idea._id !== selectedIdea._id));

      toast({
        title: "Success",
        description: "Your idea has been deleted.",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast({
        title: "Error",
        description: "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof editIdeaSchema>) => {
    if (!selectedIdea) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ideas/${selectedIdea._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          tags: tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update idea");
      }

      const updatedIdea = await response.json();

      // Update the idea in the list
      setIdeas(
        ideas.map((idea) =>
          idea._id === selectedIdea._id ? { ...idea, ...updatedIdea } : idea
        )
      );

      toast({
        title: "Success",
        description: "Your idea has been updated.",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating idea:", error);
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const input = e.currentTarget;
      const value = input.value.trim();

      if (value && !tags.includes(value) && tags.length < 5) {
        setTags([...tags, value]);
        input.value = "";
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your ideas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {"You haven't shared any ideas yet."}
        </p>
        <Button onClick={() => router.push("/explore/ideas")}>
          Share Your First Idea
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ideas.map((idea) => (
        <Card key={idea._id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1">{idea.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(idea.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {idea.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{idea.likes.length} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{idea.comments.length} comments</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(idea)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => handleDelete(idea)}
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Edit Idea Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
            <DialogDescription>
              Make changes to your idea and save them.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a title for your idea"
                        {...field}
                      />
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
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
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
                        placeholder="Enter tags and press Enter (max 5)"
                        onKeyDown={handleAddTag}
                      />
                    </FormControl>
                    <FormDescription>
                      Add up to 5 tags to categorize your idea
                    </FormDescription>
                    <FormMessage />

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="rounded-full hover:bg-primary/20 p-0.5"
                            >
                              <Trash className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-5 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this idea? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 ">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
