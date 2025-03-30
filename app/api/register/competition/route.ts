/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Competition } from "@/app/models/competition"

export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()

    // Create competition with the provided data
    const competition = await Competition.create({
      name: data.name,
      description: data.description,
      type: data.type,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      maxTeamSize: data.maxTeamSize,
      prize: data.prize,
      requirements: data.requirements,
      rules: data.rules,
    })

    return NextResponse.json(
      {
        message: "Competition registered successfully",
        competition,
      },
      { status: 201 },
    )
  } catch (error: any) {
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
    console.error("Competition registration error:", error)
    return NextResponse.json(
      {
        message: "Failed to register competition",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connect()

    const competitions = await Competition.find()
      .select("name description type startDate endDate prize status maxTeamSize")
      .sort({ startDate: 1 })
      .limit(10)

    return NextResponse.json(competitions)
  } catch (error: any) {
    console.error("Error fetching competitions:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch competitions",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

