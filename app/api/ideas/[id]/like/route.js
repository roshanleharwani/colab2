import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Idea } from "@/app/models/idea"

export async function POST(req, { params }) {
  try {
    await connect()

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    const idea = await Idea.findById(params.id)

    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    // Check if user already liked the idea
    const existingLikeIndex = idea.likes.findIndex((like) => like.userId === userId)

    if (existingLikeIndex !== -1) {
      // Unlike: Remove the like
      idea.likes.splice(existingLikeIndex, 1)
    } else {
      // Like: Add a new like
      idea.likes.push({
        userId,
        createdAt: new Date(),
      })
    }

    await idea.save()

    return NextResponse.json({
      message: existingLikeIndex !== -1 ? "Idea unliked" : "Idea liked",
      likeCount: idea.likes.length,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ message: "Failed to toggle like", error: error.message }, { status: 500 })
  }
}

