/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Idea } from "@/app/models/idea"

// GET a specific idea
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    const idea = await Idea.findById(params.id)

    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json(idea)
  } catch (error: any) {
    console.error("Error fetching idea:", error)
    return NextResponse.json({ message: "Failed to fetch idea", error: error.message }, { status: 500 })
  }
}

// UPDATE an idea
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    const data = await req.json()

    // Check if the user is the author (in a real app)
    // This would require authentication middleware

    const updatedIdea = await Idea.findByIdAndUpdate(
      params.id,
      {
        title: data.title,
        description: data.description,
        tags: data.tags,
      },
      { new: true, runValidators: true },
    )

    if (!updatedIdea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json(updatedIdea)
  } catch (error: any) {
    console.error("Error updating idea:", error)
    return NextResponse.json({ message: "Failed to update idea", error: error.message }, { status: 500 })
  }
}

// DELETE an idea
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect()

    // Check if the user is the author (in a real app)
    // This would require authentication middleware

    const deletedIdea = await Idea.findByIdAndDelete(params.id)

    if (!deletedIdea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Idea deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting idea:", error)
    return NextResponse.json({ message: "Failed to delete idea", error: error.message }, { status: 500 })
  }
}

