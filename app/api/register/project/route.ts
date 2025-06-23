/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Project } from "@/app/models/project"

export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()
    console.log(data);
    // Transform tech stack from comma-separated string to array
    if (typeof data.techStack === "string") {
      data.techStack = data.techStack.split(",").map((tech: string) => tech.trim())
    }

    // Create project with transformed data
    const project = await Project.create({
      name: data.name,
      description: data.description,
      category: data.category,
      projectType: data.projectType,
      duration: data.duration,
      teamSize: data.teamSize,
      techStack: data.techStack,
      githubUrl: data.githubUrl,
      leader: {
        id:data.leaderId,
        name: data.leaderName,
        email: data.leaderEmail,
        regNumber: data.leaderRegNumber,
      },
      requirements: data.requirements,
      isRecruiting: true,
      status:"active"
    })

    return NextResponse.json(
      {
        message: "Project registered successfully",
        project,
      },
      { status: 201 },
    )
  } catch (error: any) {
    // Handle validation errors
    console.log("I am in the error block")
    console.log(error.name);
    console.error("Error registering project:", error)
    return NextResponse.json(
      {
        message: "Failed to register project",
        error: error.message,
      },
      { status: 500 },)
  }
}

export async function GET() {
  try {
    await connect()

    const projects = await Project.find({ isRecruiting: true })
      .select("_id name description category projectType teamSize techStack status githubUrl ")
      .sort({ createdAt: -1 })
      

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch projects",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

