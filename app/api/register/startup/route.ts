/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import connect from "@/lib/connect"
import { Startup } from "@/app/models/startup"

export async function POST(req: Request) {
  try {
    await connect()

    const data = await req.json()

    // Create startup with the provided data
    const startup = await Startup.create({
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      industry: data.industry,
      fundingStage: data.fundingStage,
      founded: data.founded,
      location: data.location,
      website: data.website,
      metrics: {
        users: data.metrics?.users,
        growth: data.metrics?.growth,
        institutions: data.metrics?.institutions,
      },
      maxTeamSize: data.maxTeamSize,
      founder: {
        name: data.founderName,
        email: data.founderEmail,
        regNumber: data.founderRegNumber,
        role: data.founderRole,
      },
      requirements: data.requirements,
      isRecruiting: true,
    })

    return NextResponse.json(
      {
        message: "Startup registered successfully",
        startup,
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
    console.error("Startup registration error:", error)
    return NextResponse.json(
      {
        message: "Failed to register startup",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connect()

    const startups = await Startup.find({ isRecruiting: true })
      .select("name tagline description industry fundingStage location title category team maxTeamSize isRecruiting ")
      .sort({ createdAt: -1 })
      .limit(10)

    return NextResponse.json(startups)
  } catch (error: any) {
    console.error("Error fetching startups:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch startups",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

