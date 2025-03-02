"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface user {
  _id: string;
  name: string;
  registration_number: string;
}

interface TeamMembers {
  user: user;
  role: string;
}
interface TeamMember {
  name: string;
  email: string;
  regNumber: string;
  role: string;
}

interface TeamRosterProps {
  leader: TeamMember;
  members: TeamMembers[];
}
import { v4 as uuidv4 } from "uuid";
export function TeamRoster({ leader, members }: TeamRosterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Roster</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Team Leader Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Team Leader
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                  {/* <Avatar className="h-12 w-12">
                    <AvatarFallback>{leader.name[0]}</AvatarFallback>
                  </Avatar> */}
                  <div className="flex-1">
                    <div className="font-medium">{leader.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {leader.role} • {leader.regNumber}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Team Members Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Team Members
          </h3>
          <div className="space-y-4">
            {members.map((member) => (
              <TooltipProvider key={uuidv4()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      {/* <Avatar>
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar> */}
                      <div className="flex-1">
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role} • {member.user.registration_number}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
