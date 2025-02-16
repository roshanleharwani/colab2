/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { JoinRequest } from "@/app/models/join-request"

export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()

    // Create join request with the provided data
    const joinRequest = await JoinRequest.create({
      type: data.type,
      projectId: data.type === "project" ? data.entityId : undefined,
      startupId: data.type === "startup" ? data.entityId : undefined,
      teamId: data.type === "team" ? data.entityId : undefined,
      userId: data.userId,
      message: data.message,
      role: data.role,
    })

    return NextResponse.json(
      {
        message: "Join request sent successfully",
        joinRequest,
      },
      { status: 201 },
    )
  } catch (error: any) {
    // Handle duplicate request error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "You have already sent a request that is pending",
        },
        { status: 409 },
      )
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 },
      )
    }

    // Handle other errors
    console.error("Join request error:", error)
    return NextResponse.json(
      {
        message: "Failed to send join request",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  try {
    await connect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status") || "pending"

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    const requests = await JoinRequest.find({ userId, status })
      .populate([
        {
          path: "projectId",
          select: "name description category",
        },
        {
          path: "startupId",
          select: "name tagline industry",
        },
        {
          path: "teamId",
          select: "name description competition",
          populate: {
            path: "competition",
            select: "name type",
          },
        },
      ])
      .sort({ createdAt: -1 })

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

export async function PATCH(req: Request) {
  try {
    await connect()

    const data = await req.json()
    const { requestId, status, userId } = data

    if (!requestId || !status || !userId) {
      return NextResponse.json({ message: "Request ID, status, and user ID are required" }, { status: 400 })
    }

    const joinRequest = await JoinRequest.findOneAndUpdate({ _id: requestId }, { status }, { new: true })

    if (!joinRequest) {
      return NextResponse.json({ message: "Join request not found" }, { status: 404 })
    }

    // If request is accepted, add user to the respective team/project/startup
    if (status === "accepted") {
      // Handle adding user to the team/project/startup
      // This would require additional logic based on your requirements
    }

    return NextResponse.json({
      message: `Join request ${status}`,
      joinRequest,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating join request:", error)
    return NextResponse.json(
      {
        message: "Failed to update join request",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

