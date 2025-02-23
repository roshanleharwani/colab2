/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Idea } from "@/app/models/idea"

export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()

    const idea = await Idea.create({
      title: data.title,
      description: data.description,
      category: data.category,
      author: {
        name: data.authorName,
        regNumber: data.authorRegNumber,
        avatar: data.authorAvatar,
      },
      tags: data.tags,
    })

    return NextResponse.json(
      {
        message: "Idea posted successfully",
        idea,
      },
      { status: 201 },
    )
  } catch (error: any) {
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

    console.error("Error posting idea:", error)
    return NextResponse.json(
      {
        message: "Failed to post idea",
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
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "latest"

    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    let sortOptions: any = { createdAt: -1 }
    if (sort === "popular") {
      sortOptions = { likes: -1 }
    }

    const ideas = await Idea.find(query).sort(sortOptions).limit(50)

    return NextResponse.json(ideas)
  } catch (error: any) {
    console.error("Error fetching ideas:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch ideas",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

