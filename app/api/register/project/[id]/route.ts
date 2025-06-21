 
import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/connect";
import { Project } from "@/app/models/project";
import User from "@/app/models/User";


export async function GET(req: NextRequest, context: { params: { id: string } }) {
    console.log("I am here");
    
    const { id } = context.params;
    try {
        await connect();

        // Fetch project details
        const project = await Project.findById(id)
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        console.log("Project details: ", project);

        const members = [];
        if (project.members.length > 0) {
            for (const member of project.members) {
                const user = await User.findById(member.UserId).select("_id name registration_number")
                console.log("User: ", user);
                const formattedMember={user,role:member.role}
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
