import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users } from "lucide-react";

// This would come from your database
const mockCompetition = {
  id: "1",
  name: "Hackathon 2024",
  description: "Annual college hackathon focused on AI/ML solutions",
  startDate: "2024-03-01",
  endDate: "2024-03-03",
  teams: [
    {
      id: "team1",
      name: "CodeCrafters",
      members: 4,
      recruiting: true,
      description: "Building an AI-powered study assistant",
    },
    {
      id: "team2",
      name: "DataMinds",
      members: 3,
      recruiting: true,
      description: "Creating a predictive analytics platform",
    },
    // Add more teams as needed
  ],
};

export default function CompetitionPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{mockCompetition.name}</h1>
        <p className="text-muted-foreground mb-4">
          {mockCompetition.description}
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Start: {mockCompetition.startDate}</span>
          <span>End: {mockCompetition.endDate}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCompetition.teams.map((team) => (
          <Card
            key={team.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <Link href={`/explore/teams/${team.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{team.name}</span>
                  {team.recruiting && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Recruiting
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{team.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{team.members} members</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
