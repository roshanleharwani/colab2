"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface JoinProjectRequestProps {
  project: {
    id: string;
    name: string;
    recruiting: boolean;
    leader: {
      id: string;
    };
  };
  isFullyRecruited: boolean;
}

export function JoinProjectRequest({
  project,
  isFullyRecruited,
}: JoinProjectRequestProps) {
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userId = JSON.parse(loggedInUser);
      console.log(userId);
      setUser(userId);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project.recruiting || isFullyRecruited) return;
    console.log("before pending");
    setIsPending(true);
    console.log("after pending");
    console.log("project id:", project.id);
    console.log(role);
    console.log(message);
    try {
      // sending request to the project leader
      const response = await fetch("/api/join-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "project",
          projectId: project.id,
          role,
          message,
          user: user,
          leader: project.leader.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send join request");
      }
      toast({
        title: "Join request sent",
        description: "Your request has been sent to the project leader.",
      });

      setMessage("");
      setRole("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsPending(false);
    }
  }

  if (isFullyRecruited) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Team is Full</CardTitle>
          <CardDescription>
            This project has recruited all required team members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!project.recruiting) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Not Recruiting</CardTitle>
          <CardDescription>
            This project is not currently looking for new members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Project</CardTitle>
        <CardDescription>
          Send a request to join this project. The team leader will review your
          application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Role</label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                <SelectItem value="ml">Machine Learning Engineer</SelectItem>
                <SelectItem value="ui">UI/UX Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Introduce yourself and explain why you'd like to join this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending request..." : "Send join request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
