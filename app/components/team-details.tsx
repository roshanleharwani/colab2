import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trophy } from "lucide-react"

interface TeamDetailsProps {
  team: {
    name: string
    description: string
    recruiting: boolean
    competition: {
      id: string
      name: string
    }
  }
}

export function TeamDetails({ team }: TeamDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{team.name}</CardTitle>
            <Link
              href={`/competitions/${team.competition.id}`}
              className="text-sm text-muted-foreground hover:text-primary flex items-center mt-1"
            >
              <Trophy className="h-4 w-4 mr-1" />
              {team.competition.name}
            </Link>
          </div>
          {team.recruiting && (
            <Badge variant="secondary" className="text-primary">
              Recruiting
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{team.description}</p>
      </CardContent>
    </Card>
  )
}

