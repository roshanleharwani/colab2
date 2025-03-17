import { TeamDetails } from "@/app/components/team-details";
import { TeamMembers } from "@/app/components/team-members";
import { JoinRequest } from "@/app/components/join-request";


// This would come from your database
const mockTeam = {
  id: "team1",
  name: "CodeCrafters",
  description: "Building an AI-powered study assistant",
  recruiting: true,
  competition: {
    id: "1",
    name: "Hackathon 2024",
  },
  leader: {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg",
    role: "Team Leader",
  },
  members: [
    {
      id: "user2",
      name: "Jane Smith",
      avatar: "/placeholder.svg",
      role: "Frontend Developer",
    },
    {
      id: "user3",
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      role: "Backend Developer",
    },
    // Add more members as needed
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TeamPage({ params }: { params: { id: string } }) {
 
  
  return (
    <div className="container mx-auto py-8 px-4">
      <TeamDetails team={mockTeam} />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <div className="lg:col-span-2">
          <TeamMembers leader={mockTeam.leader} members={mockTeam.members} />
        </div>
        <div>
          <JoinRequest team={mockTeam} />
        </div>
      </div>
    </div>
  );
}
