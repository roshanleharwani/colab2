"use client";

import { ProjectDetails } from "@/app/components/project-details";
import { TeamRoster } from "@/app/components/team-roster";
import { JoinProjectRequest } from "@/app/components/join-project-request";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectPage() {
  const [project, setProject] = useState({
    _id: "",
    name: "",
    description: "",
    status: "",
    teamSize: 0,
    techStack: [],
    githubUrl: "",
    isRecruiting: false,
    members: [],
    leader: {
      name: "",
      email: "",
      regNumber: "",
      id: "",
    },
  });
  const [members, setMembers] = useState([]);
  const { id } = useParams();
  console.log("projectId: ", id);
  useEffect(() => {
    // fetching project details from the server
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/register/project/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching project details");
        }
        const data = await response.json();

        setProject(data.project);
        setMembers(data.members);
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };
    fetchProject();
  }, [id]);
  const isFullyRecruited = members.length >= project.teamSize;
  console.log("Project: ", project);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <ProjectDetails project={project} />
          <TeamRoster
            leader={{
              name: project.leader.name,
              email: project.leader.email,
              regNumber: project.leader.regNumber,
              role: "Project Lead",
            }}
            members={members}
          />
        </div>
        <div>
          <JoinProjectRequest
            project={{
              id: project._id,
              name: project.name,
              recruiting: project.isRecruiting,
              leader: { id: project.leader.id },
            }}
            isFullyRecruited={isFullyRecruited}
          />
        </div>
      </div>
    </div>
  );
}
