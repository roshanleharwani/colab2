/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Idea } from "@/app/models/idea"
import mongoose from "mongoose"

// GET comments for an idea
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    const idea = await Idea.findById(params.id).select("comments")

    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json(idea.comments)
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ message: "Failed to fetch comments", error: error.message }, { status: 500 })
  }
}

// POST a new comment
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    const { content, authorId, authorName, authorAvatar } = await req.json()

    if (!content || !authorId || !authorName) {
      return NextResponse.json({ message: "Content, author ID, and author name are required" }, { status: 400 })
    }

    const idea = await Idea.findById(params.id)

    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    const commentId = new mongoose.Types.ObjectId().toString()

    const newComment = {
      _id: commentId,
      author: {
        id: authorId,
        name: authorName,
        avatar: authorAvatar || null,
      },
      content,
      createdAt: new Date(),
    }

    idea.comments.push(newComment)
    await idea.save()

    return NextResponse.json({ message: "Comment added successfully", comment: newComment }, { status: 201 })
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ message: "Failed to add comment", error: error.message }, { status: 500 })
  }
}

// DELETE a comment
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    const { commentId, userId } = await req.json()

    if (!commentId || !userId) {
      return NextResponse.json({ message: "Comment ID and user ID are required" }, { status: 400 })
    }

    const idea = await Idea.findById(params.id)

    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    // Find the comment
    const commentIndex = idea.comments.findIndex((comment:any) => comment._id === commentId)

    if (commentIndex === -1) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    // Check if the user is the author of the comment
    if (idea.comments[commentIndex].author.id !== userId) {
      return NextResponse.json({ message: "Unauthorized: You can only delete your own comments" }, { status: 403 })
    }

    // Remove the comment
    idea.comments.splice(commentIndex, 1)
    await idea.save()

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ message: "Failed to delete comment", error: error.message }, { status: 500 })
  }
}

