import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Member {
  id: string
  name: string
  avatar: string
  role: string
}

interface TeamMembersProps {
  leader: Member
  members: Member[]
}

export function TeamMembers({ leader, members }: TeamMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Team Leader</h3>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={leader.avatar} />
              <AvatarFallback>{leader.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{leader.name}</div>
              <div className="text-sm text-muted-foreground">{leader.role}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Members</h3>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

