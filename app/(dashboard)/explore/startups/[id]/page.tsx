import { StartupDetails } from "@/app/components/startup-details";
import { TeamRoster } from "@/app/components/startup-team";
import { JoinStartupRequest } from "@/app/components/join-startup-request";

// This would come from your database
const mockStartup = {
  id: "1",
  name: "EduTech Solutions",
  tagline: "Revolutionizing personalized learning through AI",
  description:
    "We're building an AI-powered educational platform that adapts to each student's learning style and pace, making quality education accessible to everyone.",
  industry: "Education Technology",
  fundingStage: "Seed",
  founded: "2023",
  location: "Bangalore, India",
  metrics: {
    users: "5,000+",
    growth: "200% MoM",
    institutions: "10+",
  },
  recruiting: true,
  maxTeamSize: 8,
  founders: [
    {
      id: "user1",
      name: "Rahul Mehta",
      regNumber: "2020CS1001",
      role: "CEO & Co-founder",
      avatar: "/placeholder.svg",
      expertise: "Product Strategy, AI",
    },
    {
      id: "user2",
      name: "Priya Sharma",
      regNumber: "2020CS1002",
      role: "CTO & Co-founder",
      avatar: "/placeholder.svg",
      expertise: "Machine Learning, Backend",
    },
  ],
  team: [
    {
      id: "user3",
      name: "Arun Kumar",
      regNumber: "2021CS1045",
      role: "Senior Developer",
      avatar: "/placeholder.svg",
      expertise: "Full Stack Development",
    },
    {
      id: "user4",
      name: "Sneha Patel",
      regNumber: "2021CS1078",
      role: "ML Engineer",
      avatar: "/placeholder.svg",
      expertise: "Machine Learning, Python",
    },
  ],
  openings: [
    {
      id: "role1",
      title: "Frontend Developer",
      type: "Technical",
      commitment: "Full-time",
      requirements: ["React", "TypeScript", "UI/UX knowledge"],
    },
    {
      id: "role2",
      title: "Growth Marketer",
      type: "Business",
      commitment: "Full-time",
      requirements: ["Digital Marketing", "Analytics", "Content Strategy"],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StartupPage({ params }: { params: { id: string } }) {
  const isFullyRecruited =
    mockStartup.founders.length + mockStartup.team.length >=
    mockStartup.maxTeamSize;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <StartupDetails startup={mockStartup} />
          <TeamRoster founders={mockStartup.founders} team={mockStartup.team} />
        </div>
        <div>
          <JoinStartupRequest
            startup={mockStartup}
            isFullyRecruited={isFullyRecruited}
          />
        </div>
      </div>
    </div>
  );
}
