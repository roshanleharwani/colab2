/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/connect";
import { Project } from "@/app/models/project";
import User from "@/app/models/User";


export async function GET(req: NextRequest, context: { params: { id: string } }) {
    console.log("I am here");
    
    const { id } = context.params; // ❌ No need for await here
    try {
        await connect();

        // Fetch project details
        const project = await Project.findById(id).select("_id name description teamSize techStack leader members status isRecruiting");
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        console.log("Project details: ", project);

        let members = [];
        if (project.members.length > 0) {
            for (const member of project.members) {
                const user = await User.findById(member.id).select("_id name registration_number")
                const formattedMember={...user,role:member.role}
                members.push(formattedMember);
            }
        }
        console.log("Members: ", members);


        return NextResponse.json({ project, members});

    } catch (error) {
        console.error("Error fetching project details: ", error);
        return NextResponse.json({ message: "Error fetching project details" }, { status: 500 });
    }
}
