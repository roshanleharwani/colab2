/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JoinRequestProps {
  team: {
    id: string;
    name: string;
    recruiting: boolean;
  };
}

export function JoinRequest({ team }: JoinRequestProps) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!team.recruiting) return;

    setIsPending(true);
    try {
      toast({
        title: "Request sent!",
        description: `Your request to join ${team.name} has been sent to the team leader.`,
      });
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  if (!team.recruiting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team not recruiting</CardTitle>
          <CardDescription>
            This team is not currently looking for new members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Team</CardTitle>
        <CardDescription>
          Send a request to join this team. The team leader will review your
          request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Introduce yourself and explain why you'd like to join the team..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending request..." : "Send join request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
