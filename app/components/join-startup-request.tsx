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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface JoinStartupRequestProps {
  startup: {
    id: string;
    name: string;
    recruiting: boolean;
    openings: {
      id: string;
      title: string;
      type: string;
      commitment: string;
      requirements: string[];
    }[];
  };
  isFullyRecruited: boolean;
}

export function JoinStartupRequest({
  startup,
  isFullyRecruited,
}: JoinStartupRequestProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const selectedOpening = startup.openings.find(
    (opening) => opening.id === selectedRole
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startup.recruiting || isFullyRecruited) return;

    setIsPending(true);
    try {
      toast({
        title: "Request sent!",
        description: `Your request to join ${startup.name} has been sent to the founders.`,
      });
      setMessage("");
      setSelectedRole("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (isFullyRecruited) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Team is Full</CardTitle>
          <CardDescription>
            This startup has recruited all required team members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!startup.recruiting) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Not Hiring</CardTitle>
          <CardDescription>
            This startup is not currently looking for new team members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>
            Current opportunities to join the team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {startup.openings.map((opening) => (
            <div
              key={opening.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{opening.title}</h3>
                <Badge variant="outline">{opening.commitment}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{opening.type}</p>
                <div className="flex flex-wrap gap-2">
                  {opening.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join Startup</CardTitle>
          <CardDescription>
            Send a request to join this startup. The founders will review your
            application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {startup.openings.map((opening) => (
                    <SelectItem key={opening.id} value={opening.id}>
                      {opening.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOpening && (
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {selectedOpening.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter</label>
              <Textarea
                placeholder="Introduce yourself and explain why you'd like to join this startup..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending request..." : "Send application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
