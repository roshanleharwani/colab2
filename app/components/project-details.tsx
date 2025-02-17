"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface ProjectDetailsProps {
  project: {
    name: string
    description: string
    status: string
    teamSize: number
    techStack: string[]
    isRecruiting: boolean
    members: any[]
  }
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const isFullyRecruited = project.members.length >= project.teamSize

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{project.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>{project.status}</Badge>
              {project.isRecruiting && !isFullyRecruited ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Recruiting
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
              {project.members.length}/{project.teamSize} members
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">About the Project</h3>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="bg-primary/5">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

