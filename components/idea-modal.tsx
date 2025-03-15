"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ThumbsUp, MessageSquare, Calendar, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
}

interface Idea {
  _id: string;
  title: string;
  description: string;
  author: Author;
  createdAt: string;
  likes: Array<{
    userId: string;
    createdAt: string;
  }>;
  comments: Comment[];
  tags: string[];
}

interface IdeaModalProps {
  idea: Idea;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  isLiked: boolean;
  onLike: () => void;
  onAddComment: (content: string) => void;
}

export function IdeaModal({
  idea,
  currentUser,
  isLiked,
  onLike,
  onAddComment,
}: IdeaModalProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddComment(comment);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
            <Avatar>
              <AvatarFallback>{idea.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{idea.author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(idea.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        </div>
        <DialogTitle className="text-2xl mt-4">{idea.title}</DialogTitle>
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-primary/5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </DialogHeader>

      <div className="my-6">
        <DialogDescription className="text-foreground whitespace-pre-wrap">
          {idea.description}
        </DialogDescription>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onLike}
        >
          <ThumbsUp
            className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`}
          />
          <span>
            {idea.likes.length} {idea.likes.length === 1 ? "Like" : "Likes"}
          </span>
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>
            {idea.comments.length}{" "}
            {idea.comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="mt-6">
        <h4 className="font-medium mb-4">Comments</h4>

        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
          {idea.comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            idea.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{comment.author.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>{currentUser?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  currentUser ? "Add a comment..." : "Please log in to comment"
                }
                className="flex-1"
                disabled={!currentUser}
              />
              <Button
                type="submit"
                disabled={!currentUser || !comment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
