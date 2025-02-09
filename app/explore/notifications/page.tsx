import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This would come from your database
const mockRequests = [
  {
    id: "req1",
    user: {
      id: "user4",
      name: "Alice Brown",
      avatar: "/placeholder.svg",
    },
    team: {
      id: "team1",
      name: "CodeCrafters",
    },
    message:
      "I'm a frontend developer with React experience. I'd love to join your team!",
    createdAt: "2024-02-08T10:00:00Z",
  },
  // Add more requests as needed
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Join Requests</h1>
      <div className="space-y-4">
        {mockRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Request to join {request.team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={request.user.avatar} />
                  <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{request.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">{request.message}</p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    // Handle accept request
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Handle reject request
                  }}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
