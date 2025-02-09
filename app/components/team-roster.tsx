import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamMember {
  id: string
  name: string
  regNumber: string
  role: string
  avatar: string
  expertise: string
}

interface TeamRosterProps {
  leader: TeamMember
  members: TeamMember[]
}

export function TeamRoster({ leader, members }: TeamRosterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Roster</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Team Leader Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Team Leader</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={leader.avatar} />
                    <AvatarFallback>{leader.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{leader.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {leader.role} • {leader.regNumber}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expertise: {leader.expertise}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Team Members Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Team Members</h3>
          <div className="space-y-4">
            {members.map((member) => (
              <TooltipProvider key={member.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role} • {member.regNumber}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expertise: {member.expertise}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

