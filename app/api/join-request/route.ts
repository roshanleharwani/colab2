/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { JoinRequest } from "@/app/models/join-request"
import { Project } from "@/app/models/project"


export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()
    // Create join request with the provided data
    const existingRequest = await JoinRequest.findOne({
      FromUserId: data.user,
      projectId: data.projectId ,
      status: "accept",
    });
    console.log("existingRequest",existingRequest);

    if (existingRequest) {
      console.log("You have already sent a request")
      return NextResponse.json({ message: "You have already sent a request" }, { status: 400 });
    }
    console.log("passed this test")
    const joinRequest = await JoinRequest.create({
      type: data.type,
      projectId: data.type === "project" ? data.projectId : undefined,
      FromUserId:data.user,
      ToUserId:data.leader,
      message: data.message,
      role: data.role,
    })
    console.log("joinRequest",joinRequest);

    return NextResponse.json(
      {
        message: "Join request sent successfully",
        joinRequest,
      },
      { status: 201 },
    )
  } catch (error: any) {
    // Handle duplicate request error

    // Handle validation errors
    console.error("Error creating join request:", error)
    return NextResponse.json({message: "Failed to send join request", error: error.message}, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {

    await connect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    const requests = await JoinRequest.find({ ToUserId:userId, status:"pending" }).select(" _id FromUserId projectId role message createdAt").populate("FromUserId","name")



    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Error fetching join requests:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch join requests",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req:Request){
  const data=await req.json();
  console.log("data",data);
  try{
    await connect();
    const request=await JoinRequest.findById(data.requestId);
    console.log(request);
    if(!request){
      return NextResponse.json({message:"Request not found"},{status:404});
    }
    if(request.status!=="pending"){
      return NextResponse.json({message:"Request has already been processed"},{status:400});
    }
    request.set("status",data.status); 
    await request.save();
    if(data.status==="accept"){
      const project=await Project.findById(request.projectId);
      const newMember={
        UserId:request.FromUserId,
        role:request.role
      }
      console.log("newMember",newMember);
      project.members.push(newMember)
      await project.save();
      console.log(project)
    }
    return NextResponse.json({message:"Request updated successfully"},{status:200});
  }catch(error:any){
    console.error("Error updating request:",error);
    return NextResponse.json({message:"Failed to update request",error:error.message},{status:500});
  }
}