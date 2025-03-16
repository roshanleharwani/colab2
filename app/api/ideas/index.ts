/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Idea } from "@/app/models/idea"

// GET all ideas with optional filtering
export async function GET(req: Request) {
  try {
    await connect()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "latest"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const authorId = searchParams.get("authorId")

    const query: any = {}

    // Filter by author if authorId is provided
    if (authorId) {
      query["author.id"] = authorId
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Determine sort order
    let sortOptions: any = { createdAt: -1 } // Default to latest
    if (sort === "popular") {
      sortOptions = { "likes.length": -1, createdAt: -1 }
    }

    const ideas = await Idea.find(query).sort(sortOptions).limit(limit)

    return NextResponse.json(ideas)
  } catch (error: any) {
    console.error("Error fetching ideas:", error)
    return NextResponse.json({ message: "Failed to fetch ideas", error: error.message }, { status: 500 })
  }
}

// POST a new idea
export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()
    console.log("Received data:", data) // Log the received data for debugging

    // Ensure required fields are present
    if (!data.title || !data.description || !data.authorId || !data.authorName) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: ["Missing required fields: title, description, authorId, or authorName"],
        },
        { status: 400 },
      )
    }

    const ideaData = {
      title: data.title,
      description: data.description,
      author: {
        id: data.authorId,
        name: data.authorName,
        avatar: data.authorAvatar || null,
      },
      tags: Array.isArray(data.tags) ? data.tags : [],
      likes: [],
      comments: [],
    }

    const idea = await Idea.create(ideaData)

    return NextResponse.json({ message: "Idea created successfully", idea }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating idea:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ message: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ message: "Failed to create idea", error: error.message }, { status: 500 })
  }
}

