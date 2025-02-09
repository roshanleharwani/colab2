import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, Users, GraduationCap, MapPin } from "lucide-react"

interface StartupDetailsProps {
  startup: {
    name: string
    tagline: string
    description: string
    industry: string
    fundingStage: string
    founded: string
    location: string
    metrics: {
      users: string
      growth: string
      institutions: string
    }
    recruiting: boolean
    founders: any[]
    team: any[]
    maxTeamSize: number
  }
}

export function StartupDetails({ startup }: StartupDetailsProps) {
  const isFullyRecruited = startup.founders.length + startup.team.length >= startup.maxTeamSize

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{startup.name}</CardTitle>
            <p className="text-muted-foreground mb-2">{startup.tagline}</p>
            <div className="flex items-center gap-2">
              <Badge variant="default">{startup.fundingStage}</Badge>
              {startup.recruiting && !isFullyRecruited ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Hiring
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Team Full
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {startup.founders.length + startup.team.length}/{startup.maxTeamSize} members
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">About</h3>
          <p className="text-muted-foreground">{startup.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="text-sm">Industry</span>
            </div>
            <p className="font-medium">{startup.industry}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm">Founded</span>
            </div>
            <p className="font-medium">{startup.founded}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Location</span>
            </div>
            <p className="font-medium">{startup.location}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="text-sm">Growth</span>
            </div>
            <p className="font-medium">{startup.metrics.growth}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{startup.metrics.users}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{startup.metrics.growth}</div>
            <div className="text-sm text-muted-foreground">Monthly Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{startup.metrics.institutions}</div>
            <div className="text-sm text-muted-foreground">Partner Institutions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

