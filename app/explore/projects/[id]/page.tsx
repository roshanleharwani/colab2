"use client"

import { ProjectDetails } from "@/app/components/project-details";
import { TeamRoster } from "@/app/components/team-roster";
import { JoinProjectRequest } from "@/app/components/join-project-request";
import { useParams } from "next/navigation";
import {useEffect,useState} from "react";
// This would come from your database
const mockProject = {
  id: "1",
  name: "AI-Powered Study Assistant",
  description:
    "Building an intelligent study companion that helps students optimize their learning patterns and improve retention through personalized recommendations.",
  status: "In Progress",
  maxMembers: 5,
  techStack: ["React", "Python", "TensorFlow", "Node.js"],
  recruiting: true,
  leader: {
    id: "user1",
    name: "Sarah Chen",
    regNumber: "2021CS1032",
    role: "Project Lead",
    avatar: "/placeholder.svg",
    expertise: "Machine Learning",
  },
  members: [
    {
      id: "user2",
      name: "Alex Kumar",
      regNumber: "2021CS1045",
      role: "Frontend Developer",
      avatar: "/placeholder.svg",
      expertise: "React, TypeScript",
    },
    {
      id: "user3",
      name: "Priya Sharma",
      regNumber: "2021CS1078",
      role: "Backend Developer",
      avatar: "/placeholder.svg",
      expertise: "Node.js, Python",
    },
    // Add more members as needed
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProjectPage(){
  const [project,setProject]=useState({
    _id: "",
    name: "",
    description: "",
    status: "",
    teamSize: 0,
    techStack: [],
    isRecruiting: false,
    members: [],
    leader:{
      name: "",
      email: "",
      regNumber: "",
      id:"",
    }
  });
  const [members,setMembers]=useState([]);
  const {id}=useParams();
  console.log("projectId: ",id);
  useEffect(() => {
    // fetching project details from the server
    const fetchProject=async()=>{
      try{
        const response=await fetch(`/api/register/project/${id}`)
        if(!response.ok){
          throw new Error("Error fetching project details");
        }
        const data=await response.json();
        
        setProject(data.project);
        setMembers(data.members);
      }catch(error){
        console.error("Error fetching project details: ",error);
      }
    };
    fetchProject();
  }, [id]);
  const isFullyRecruited = mockProject.members.length >= mockProject.maxMembers;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <ProjectDetails project={project} />
          <TeamRoster
            leader={{ name:project.leader.name,email:project.leader.email,regNumber:project.leader.regNumber, role: "Project Lead" }}
            members={members}
          />
        </div>
        <div>
          <JoinProjectRequest
            project={{
              id:project._id,
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
